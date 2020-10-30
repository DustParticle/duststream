import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { IProject, ITriggerBuildRequest, IVariable } from '../../models';
import { RevisionService } from '../services';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'new-build',
  templateUrl: './new-build.component.html',
  styleUrls: ['./new-build.component.scss']
})
export class NewBuildComponent {
  form: FormGroup;
  project: IProject;

  variables: IVariable[];

  variablesModel = {};
  variablesFields: FormlyFieldConfig[] = [];

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewBuildComponent>, @Inject(MAT_DIALOG_DATA) public data: IProject,
    private revisionService: RevisionService,
    private formlyJsonschema: FormlyJsonschema) {
    this.project = data;

    let controls: any = {
      branch: ['master', Validators.required],
      commit: ['HEAD', Validators.required],
      variables: this.formBuilder.group({})
    };
    this.form = this.formBuilder.group(controls);
    this.variablesFields = JSON.parse(this.project.variablesDef);
  }

  trigger(): void {
    let triggerBuildRequest: ITriggerBuildRequest = this.form.value;
    triggerBuildRequest.variables = Object.entries(this.variablesModel).map(e => ({
      key: e[0].toString(), value: e[1].toString()
    }));

    if (this.project.azureDevOps) {
      this.revisionService.triggerBuildOnAzure(this.project.name, triggerBuildRequest).subscribe(() => {
        this.snackBar.open('Triggerred build successfully!', null, { duration: 1000 });
      }, () => {
        this.snackBar.open('Failed to trigger build!', null, { duration: 1000 });
      });
    }

    this.dialogRef.close();
  }
}
