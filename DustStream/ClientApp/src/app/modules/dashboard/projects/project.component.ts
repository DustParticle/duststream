import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  public revisions: IRevision[];
  public procedures: IProcedure[];
  public project: IProject;

  public executionStatus: string[][];
  public expandableTable: boolean[];
  public revisionCommitSets: string[];
  public revisionCommitPayload: object[];
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

          this.initializeExpandableTable();

          this.http.get('/api/procedures/projects/' + this.projectName).subscribe((procedures: IProcedure[]) => {
            this.procedures = procedures;

            // Sort procedures by Created Time, ascending
            this.procedures.sort(function (a, b) {
              let left = a.createdTime;
              let right = b.createdTime;
              return (left > right ? 1 : left < right ? -1 : 0);
            });

            this.executionStatus = [];
            for (var i: number = 0; i < this.revisions.length; ++i) {
              var revision = this.revisions[i].revisionNumber;
              this.executionStatus[revision] = [];
              for (var j: number = 0; j < this.procedures.length; ++j) {
                var procedure = this.procedures[j].shortName;
                this.getRevisionProcedureStatus(revision, procedure);
              }
            }
          });
        });
      });
    });
  }

  selectRow(row: IRevision) {
    this.expandableTable[row.revisionNumber] = !this.expandableTable[row.revisionNumber];
  }

  isExpanded(row: IRevision): boolean {
    return (this.expandableTable[row.revisionNumber]);
  }

  initializeExpandableTable() {
    this.expandableTable = [];
    this.revisionCommitSets = [];
    this.revisionCommitPayload = [];

    for (var i = 0; i < this.revisions.length; ++i) {
      var key = this.revisions[i].revisionNumber;
      this.expandableTable[key] = false;
      this.revisionCommitPayload[key] = JSON.parse(this.revisions[i].commitPayload);

      this.revisionCommitSets[key] = this.revisions[i].commitSet;
      this.revisionCommitSets[key] = this.revisionCommitSets[key].replace(/({|}|")/g, "");
      this.revisionCommitSets[key] = this.revisionCommitSets[key].replace(/(:)/g, ": ");
      this.revisionCommitSets[key] = this.revisionCommitSets[key].replace(/(],)/g, ']<br />');
      this.revisionCommitSets[key] = this.revisionCommitSets[key].replace(/(,)/g, ", ");
    }
  }

  getRevisionProcedureStatus(revision, procedure) {
    this.http.get('/api/procedures/' + procedure + '/executions/projects/' + this.projectName + '/revisions/' + revision + '/status').subscribe((result: string) => {
      this.executionStatus[revision][procedure] = result;
    });
  }
}
