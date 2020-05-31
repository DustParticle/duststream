import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectName = params['projectName'];

      // Get title and component info
      this.projectService.getProject(this.projectName).subscribe((project: IProject) => {
        this.project = project;

        // Get table content
        this.http.get('/api/revisions/projects/' + this.projectName).subscribe((revisions: IRevision[]) => {
          this.revisions = revisions;

          // Sort revisions by Created Time, descending
          this.revisions.sort(function (a, b) {
            let left = a.createdTime;
            let right = b.createdTime;
            return (left > right ? -1 : left < right ? 1 : 0);
          });

          this.http.get('/api/procedures/projects/' + this.projectName).subscribe((procedures: IProcedure[]) => {
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
    this.http.get('/api/procedures/' + procedure + '/executions/projects/' + this.projectName + '/revisions/' + revision + '/status').subscribe((result: string) => {
      this.executionStatus[revision][procedure] = result;
    });
  }

  getCommitPayload(commitPayload: string) {
    let obj = JSON.parse(commitPayload);
    return `Repository: ${obj.repositoryName}\nAuthor: ${obj.author}\nMessage: ${obj.message}`;
  }
}
