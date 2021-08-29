import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IProcedureExecution, IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';
import { SignalRService } from '../../../services/signal-r.service';
import { ProcedureService, ProjectService, RevisionService } from './services';
import { NewBuildComponent } from './shared/new-build.component';
import { MatPaginator } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  displayedColumns: string[];
  revisionsDataSource: MatTableDataSource<IRevision>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  // Initialize values for pagination
  page = 0;
  pageSize = 25;
  totalItems = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  public revisions: IRevision[];
  public procedures: IProcedure[];
  public project: IProject;
  public continuationTokenTable: string[];

  public executionStatus: string[][];
  public projectName: string;

  // This variable is to compare and detect new revision submitted
  public latestRevision: IRevision;

  constructor(private route: ActivatedRoute, private router: Router,
    private projectService: ProjectService, private revisionService: RevisionService,
    private procedureService: ProcedureService, private signalRService: SignalRService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectName = params['projectName'];
      // Get title and component info
      this.projectService.getProject(this.projectName).subscribe((project: IProject) => {
        this.project = project;
        this.reloadRevisions();

        this.page = 0;
        this.reloadPages();
      });
    });

    this.revisionService.newBuildTriggered.subscribe(() => this.reloadRevisions());
    this.signalRService.updateProcedureExecutionStatusTriggered.subscribe((data) => this.updateProcedureExecutionStatus(data));
  }

  reloadRevisions(): void {
    this.continuationTokenTable = [];
    this.continuationTokenTable.push("null");

    this.revisionService.getTokensByProject(this.projectName, this.pageSize).subscribe((tokenSet) => {
      tokenSet.item1.forEach(tokenData => {
        this.continuationTokenTable.push(tokenData);
      });

      this.totalItems = tokenSet.item2;
    });
  }

  onChangePage(pe: PageEvent) {
    if (pe.pageSize != this.pageSize) {
      this.pageSize = pe.pageSize;
      this.reloadRevisions();

      this.page = 0;
      this.reloadPages();
    } else {
      this.page = pe.pageIndex;
      this.reloadPages();
    }
  }

  reloadPages(): void {
    this.revisionService.getRevisionsByProject(this.projectName, this.pageSize, this.continuationTokenTable[this.page]).subscribe((revisionDataSet) => {
      this.revisions = revisionDataSet;

      // Update latest revision in case page is 0
      if (0 == this.page) {
        this.latestRevision = this.revisions[0];
      }

      this.procedureService.getProceduresByProject(this.projectName).subscribe((procedures: IProcedure[]) => {
        this.procedures = procedures;

        this.displayedColumns = ['createdTime', 'revisionNumber', 'requestor'];
        for (var i: number = 0; i < this.procedures.length; ++i) {
          this.displayedColumns.push(this.procedures[i].shortName);
        }
        this.displayedColumns.push('spacing');

        this.executionStatus = [];
        for (var i: number = 0; i < this.revisions.length; ++i) {
          var revision = this.revisions[i].revisionNumber;
          this.executionStatus[revision] = [];
          for (var j: number = 0; j < this.procedures.length; ++j) {
            var procedure = this.procedures[j].shortName;
            this.revisions[i][procedure] = procedure;
            this.getRevisionProcedureStatus(revision, procedure);
          }

          if (!this.revisions[i].requestor) {
            this.revisions[i].requestor = '';
          }
          this.revisions[i]['spacing'] = '';
        }
        this.revisionsDataSource = new MatTableDataSource(this.revisions);
      });
    });
  }

  updateProcedureExecutionStatus(data): void {
    // Only update value when the current page is identical with received object
    let procedureExecution: IProcedureExecution = data.procedureExecution;
    let revision: IRevision = data.revision;
    if (this.projectName === data.projectName) {
      // Found existed "revision" --> validate the corresponding status
      if (typeof this.revisions.find(revisionEntry => revisionEntry.revisionNumber === revision.revisionNumber) !== 'undefined') {
        if (typeof this.executionStatus[revision.revisionNumber][procedureExecution.procedureShortName] !== 'undefined') {
          this.executionStatus[revision.revisionNumber][procedureExecution.procedureShortName] = procedureExecution.status;
        }
      } else {
        // Not found revision, it means this is a new added revision, or on another page
        // Detect if created time of the item is latest --> new item validation
        if (revision.createdTime > this.latestRevision.createdTime) {
          this.reloadRevisions();

          this.latestRevision = revision;
        }

        if (0 == this.page) {
          this.reloadPages();
        }
      }
    }
  }

  getRevisionProcedureStatus(revision, procedure) {
    this.procedureService.getProceduresStatusByRevision(this.projectName, revision, procedure).subscribe((result: string) => {
      this.executionStatus[revision][procedure] = result;
    });
  }

  getCommitPayload(commitPayload: string) {
    let obj = JSON.parse(commitPayload);
    if (obj == null) {
      return '';
    }
    return `Repository: ${obj.repositoryName}\nAuthor: ${obj.author}\nMessage: ${obj.message}`;
  }

  goToSettings(): void {
    this.router.navigate(['/projects/settings/' + this.project.name]);
  }

  goToTriggerNewBuild(): void {
    const dialogRef = this.dialog.open(NewBuildComponent, {
      width: '600px',
      data: this.project
    });
  }
}
