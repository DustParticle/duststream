import { Component } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';
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
    private procedureService: ProcedureService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectName = params['projectName'];

      // Get title and component info
      this.projectService.getProject(this.projectName).subscribe((project: IProject) => {
        this.project = project;

        // Get table content
        this.revisionService.getRevisionsByProject(this.projectName).subscribe((revisions: IRevision[]) => {
          this.revisions = revisions;

          // Sort revisions by Created Time, descending
          this.revisions.sort(function (a, b) {
            let left = a.createdTime;
            let right = b.createdTime;
            return (left > right ? -1 : left < right ? 1 : 0);
          });

          this.procedureService.getProceduresByProject(this.projectName).subscribe((procedures: IProcedure[]) => {
            this.procedures = procedures;

            // Sort procedures by Created Time, ascending
            this.procedures.sort(function (a, b) {
              let left = a.createdTime;
              let right = b.createdTime;
              return (left > right ? 1 : left < right ? -1 : 0);
            });

            this.displayedColumns = ['createdTime', 'revisionNumber'];
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
              this.revisions[i]['spacing'] = '';
            }
            this.revisionsDataSource = new MatTableDataSource(this.revisions);
          });
        });
      });
    });
  }

  getRevisionProcedureStatus(revision, procedure) {
    this.procedureService.getProceduresStatusByRevision(this.projectName, revision, procedure).subscribe((result: string) => {
      this.executionStatus[revision][procedure] = result;
    });
  }

  getCommitPayload(commitPayload: string) {
    let obj = JSON.parse(commitPayload);
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
