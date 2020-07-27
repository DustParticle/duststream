import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { IProject, ICreateReleaseRequest, IVariable, IRevision } from '../../models';
import { RevisionService } from '../services';

@Component({
  selector: 'create-release',
  templateUrl: './create-release.component.html',
  styleUrls: ['./create-release.component.scss']
})
export class CreateReleaseComponent {
  form: FormGroup;
  project: IProject;
  revision: IRevision;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateReleaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private revisionService: RevisionService) {
    this.project = data.projectData;
    this.revision = data.revisionData;

    if (!this.project.variables)
      this.project.variables = [];

    let controls: any = {
      name: [this.revision.revisionNumber, Validators.required],
      releaseNotes: ['']
    };
    this.form = this.formBuilder.group(controls);
  }

  create(): void {
    let createReleaseRequest: ICreateReleaseRequest = this.form.value;

    if (this.project.azureDevOps && this.project.azureDevOps.buildDefinition && this.project.azureDevOps.artifactResourcePipeline) {
      this.revisionService.createRelease(this.project.name, this.revision.revisionNumber, createReleaseRequest).subscribe(() => {
        this.snackBar.open('Creating release ...', null, { duration: 1000 });
      }, () => {
        this.snackBar.open('Creating release was failed!', null, { duration: 1000 });
      });
    }

    this.dialogRef.close();
  }
}
