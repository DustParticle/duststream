import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { IProject, ITriggerBuildRequest } from '../../models';
import { RevisionService } from '../services';

@Component({
  selector: 'new-build',
  templateUrl: './new-build.component.html',
  styleUrls: ['./new-build.component.scss']
})
export class NewBuildComponent {
  form: FormGroup;

  useDefaultVariables: boolean = true;
  project: IProject;
  triggerBuildRequest: ITriggerBuildRequest = {
    branch: 'master',
    commit: 'HEAD',
    variables: []
  };

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewBuildComponent>, @Inject(MAT_DIALOG_DATA) public data: IProject,
    private revisionService: RevisionService) {
    this.project = data;

    if (!this.project.variables)
      this.project.variables = [];
    this.triggerBuildRequest.variables = this.project.variables.slice();      // Create a copied version of variables

    if (this.project.azureDevOps) {
      this.triggerBuildRequest.azurePat = '';
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      branch: ['', Validators.required],
      commit: ['', Validators.required],
      azurePat: ['', (this.project.azureDevOps ? Validators.required : null)],
      customVariables: [true]
    });
  }

  trigger(): void {
    if (this.useDefaultVariables) {
      this.triggerBuildRequest.variables = this.project.variables.slice();
    }
    this.revisionService.triggerBuild(this.project.name, this.triggerBuildRequest).subscribe(() => {
      this.snackBar.open('Triggerred build successfully!', null, { duration: 1000 });
    }, () => {
      this.snackBar.open('Failed to trigger build!', null, { duration: 1000 });
    });

    this.dialogRef.close();
  }
}
