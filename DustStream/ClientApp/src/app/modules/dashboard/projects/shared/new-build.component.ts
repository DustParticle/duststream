import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IVariable, IProject } from '../../models';

@Component({
  selector: 'new-build',
  templateUrl: './new-build.component.html',
  styleUrls: ['./new-build.component.scss']
})
export class NewBuildComponent {
  form: FormGroup;
  branch: string = 'master';
  commit: string = 'HEAD';
  variables: IVariable[];
  project: IProject;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<NewBuildComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProject) {
    this.project = data;
    this.variables = data.variables.slice();      // Create a copied version of variables
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      branch: ['', Validators.required],
      commit: ['', Validators.required]
    });
  }

  trigger(): void {
    this.dialogRef.close();
  }
}
