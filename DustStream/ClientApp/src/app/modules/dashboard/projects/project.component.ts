import { Component } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IProcedureExecution, IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';
import { SignalRService } from '../../../services/signal-r.service';
import { ProcedureService, ProjectService, RevisionService } from './services';
import { NewBuildComponent } from './shared/new-build.component';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  displayedColumns: string[];
  revisionsDataSource: MatTableDataSource<IRevision>;
  public revisions: IRevision[];
  public procedures: IProcedure[];
  public project: IProject;

  public executionStatus: string[][];
  public projectName: string;

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
      });
    });

    this.revisionService.newBuildTriggered.subscribe(() => this.reloadRevisions());
    this.signalRService.updateProcedureExecutionStatusTriggered.subscribe((data) => this.updateProcedureExecutionStatus(data));
  }

  reloadRevisions(): void {
    // Get table content
    this.revisionService.getRevisionsByProject(this.projectName).subscribe((revisions: IRevision[]) => {
      this.revisions = revisions;

      // Sort revisions by Created Time, descending
      this.revisions.sort(this.compareNumbers);

      this.procedureService.getProceduresByProject(this.projectName).subscribe((procedures: IProcedure[]) => {
        this.procedures = procedures;

        // Sort procedures by Created Time, ascending
        this.procedures.sort(function (a, b) {
          let left = a.createdTime;
          let right = b.createdTime;
          return (left > right ? 1 : left < right ? -1 : 0);
        });

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
        if (typeof this.executionStatus[procedureExecution.revisionNumber][procedureExecution.procedureShortName] !== 'undefined') {
          this.executionStatus[procedureExecution.revisionNumber][procedureExecution.procedureShortName] = procedureExecution.status;
        }
      } else {
        // Not found revision, it means this is a new added revision and we need to validate the whole entry
        this.executionStatus[revision.revisionNumber] = [];
        for (var j: number = 0; j < this.procedures.length; ++j) {
          var procedure = this.procedures[j].shortName;
          revision[procedure] = procedure;
          this.getRevisionProcedureStatus(revision.revisionNumber, procedure);
        }

        if (!revision.requestor) {
          revision.requestor = '';
        }
        revision['spacing'] = '';

        // Sort revisions by Created Time, descending
        this.revisions.push(revision);
        this.revisions.sort(this.compareNumbers);

        this.revisionsDataSource = new MatTableDataSource(this.revisions);
      }
    }
  }

  compareNumbers(a, b) {
    let left = a.createdTime;
    let right = b.createdTime;
    return (left > right ? -1 : left < right ? 1 : 0);
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
