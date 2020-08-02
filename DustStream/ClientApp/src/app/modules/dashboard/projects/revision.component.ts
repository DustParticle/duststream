import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProcedure, IRevision, IRelease } from '../models';
import { IProject } from '../models/project.model';
import { ProcedureService, ProjectService, RevisionService, ReleaseService } from './services';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { CreateReleaseComponent } from './shared/create-release.component';

@Component({
  selector: 'revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent {
  public revisionInfo: IRevision;
  public releaseInfo: IRelease;
  public procedures: IProcedure[];
  private projectName: string;
  private revisionNumber: string;
  public project: IProject;

  public executionStatus: string[];
  public revisionCommitPayload: object;

  public isCreatingRelease: boolean;

  constructor(private route: ActivatedRoute,
    private revisionService: RevisionService, private procedureService: ProcedureService,
    private projectService: ProjectService, private releaseService: ReleaseService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectName = params['projectName'];
      this.revisionNumber = params['revisionNumber'];
      this.revisionInfo = {
        projectName: this.projectName,
        revisionNumber: this.revisionNumber
      };

      // Initialize status variables for UI
      this.isCreatingRelease = false;

      this.projectService.getProject(this.projectName).subscribe((project: IProject) => {
        this.project = project;

        // Get revision info
        this.revisionService.getRevisionByProject(this.projectName, this.revisionNumber).subscribe((revisionInfo: IRevision) => {
          this.revisionInfo = revisionInfo;

          if (0 !== Object.keys(revisionInfo).length) {
            this.revisionCommitPayload = JSON.parse(this.revisionInfo.commitPayload);
          }
        });

        // Get release info
        this.releaseService.getReleaseByProject(this.projectName, this.revisionNumber).subscribe((releaseInfo: IRelease) => {
          this.releaseInfo = releaseInfo;
        });

        this.procedureService.getProceduresByProject(this.revisionInfo.projectName).subscribe((result: IProcedure[]) => {
          this.procedures = result;

          // Sort procedures by Created Time, ascending
          this.procedures.sort(function (a, b) {
            let left = a.createdTime;
            let right = b.createdTime;
            return (left > right ? 1 : left < right ? -1 : 0);
          });

          this.executionStatus = [];
          this.executionStatus = [];
          for (var j: number = 0; j < this.procedures.length; ++j) {
            this.getRevisionProcedureStatus(this.procedures[j].shortName);
          }
        });
      });
    });
  }

  getRevisionProcedureStatus(procedure) {
    this.procedureService.getProceduresStatusByRevision(this.projectName, this.revisionNumber, procedure).subscribe((result: string) => {
      this.executionStatus[procedure] = result;
    });
  }

  goToCreateRelease(): void {
    const dialogRef = this.dialog.open(CreateReleaseComponent, {
      width: '600px',
      data: { projectData: this.project, revisionData: this.revisionInfo, releaseData: this.releaseInfo }
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.isCreatingRelease = true;
    });
  }
}
