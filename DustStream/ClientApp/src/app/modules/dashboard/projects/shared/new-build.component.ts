import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { IProject, ITriggerBuildRequest, IVariable } from '../../models';
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
  variables: IVariable[];

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewBuildComponent>, @Inject(MAT_DIALOG_DATA) public data: IProject,
    private revisionService: RevisionService) {
    this.project = data;

    if (!this.project.variables)
      this.project.variables = [];

    let controls: any = {
      branch: ['master', Validators.required],
      commit: ['HEAD', Validators.required]
    };
    this.form = this.formBuilder.group(controls);

    this.variables = this.project.variables.slice();
  }

  trigger(): void {
    let triggerBuildRequest: ITriggerBuildRequest = this.form.value;

    if (this.useDefaultVariables) {
      triggerBuildRequest.variables = this.project.variables.slice();
    }

    if (this.project.azureDevOps) {
      this.revisionService.triggerBuildOnAzure(this.project.name, triggerBuildRequest).subscribe(() => {
        this.snackBar.open('Triggerred build successfully!', null, { duration: 1000 });
      }, () => {
        this.snackBar.open('Failed to trigger build!', null, { duration: 1000 });
      });
    }

    this.dialogRef.close();
  }

  showVariables(event) {
    this.useDefaultVariables = event.checked;
  }
}
