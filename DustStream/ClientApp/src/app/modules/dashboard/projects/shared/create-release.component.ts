import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { IProject, ICreateReleaseRequest, IVariable, IRelease, IRevision } from '../../models';
import { ReleaseService } from '../services';

@Component({
  selector: 'create-release',
  templateUrl: './create-release.component.html',
  styleUrls: ['./create-release.component.scss']
})
export class CreateReleaseComponent {
  form: FormGroup;
  project: IProject;
  revision: IRevision;
  release: IRelease;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateReleaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private releaseService: ReleaseService) {
    this.project = data.projectData;
    this.revision = data.revisionData;
    this.release = data.releaseData;

    if (!this.project.variables)
      this.project.variables = [];

    if (this.release) {
      let controls: any = {
        name: [this.release.releaseLabel, Validators.required],
        releaseNotes: [this.release.releaseNotes]
      };
      this.form = this.formBuilder.group(controls);
    } else {
      let controls: any = {
        name: [this.revision.revisionNumber, Validators.required],
        releaseNotes: ['']
      };
      this.form = this.formBuilder.group(controls);
    }
  }

  create(): void {
    let createReleaseRequest: ICreateReleaseRequest = this.form.value;

    if (this.project.azureDevOps && this.project.azureDevOps.buildDefinition && this.project.azureDevOps.artifactResourcePipeline) {
      this.releaseService.createRelease(this.project.name, this.revision.revisionNumber, createReleaseRequest).subscribe(() => {
        this.snackBar.open('Creating release ...', null, { duration: 1000 });
      }, () => {
        this.snackBar.open('Creating release was failed!', null, { duration: 1000 });
      });
    }

    this.dialogRef.close();
  }
}
