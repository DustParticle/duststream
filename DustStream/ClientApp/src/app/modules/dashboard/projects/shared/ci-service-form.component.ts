import { Component, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CodeModel } from '@ngstack/code-editor';
import { IProject } from '../../models';

function jsonValidator(control: AbstractControl) {
  try {
    JSON.parse(control.value);
  } catch {
    return { 'jsonValid': true };
  }
  return null;
}

@Component({
  selector: 'ci-service-form',
  templateUrl: './ci-service-form.component.html',
  styleUrls: ['./ci-service-form.component.scss']
})
export class CiServiceFormComponent {
  @Input() project: IProject;
  @Input() form: FormGroup;
  isFormInitialized: boolean = false;

  groupNames: Map<string, string[]> = new Map<string, string[]>();
  currentGroupName: string = '';

  theme = 'vs';

  variablesCodeModel: CodeModel = {
    language: 'json',
    uri: 'main.json',
    value: '[]',
  };

  editorOptions = {
    lineNumbers: false,
    contextmenu: false,
    wordWrap: 'on',
    automaticLayout: true,
    scrollBeyondLastLine: false
  };

  constructor(private formBuilder: FormBuilder) {
    this.groupNames.set('azureDevOps', ['organization', 'project', 'buildDefinition', 'releaseDefinition', 'artifactResourcePipeline']);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  setCiServiceGroups(ciServiceControl: AbstractControl): void {
    ciServiceControl.valueChanges.subscribe(ciService => {
      if (this.currentGroupName) {
        this.form.removeControl(this.currentGroupName);
      }

      this.currentGroupName = ciService;
      if (ciService) {
        this.switchFormGroup();
      }
    });
  }

  switchFormGroup(): FormGroup {
    let formGroup = new FormGroup({});
    this.groupNames.get(this.currentGroupName).forEach(controlName => {
      let control = new FormControl();
      control.setValidators([Validators.required]);
      formGroup.addControl(controlName, control);
    });
    this.form.addControl(this.currentGroupName, formGroup);
    return formGroup;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  initializeForm(): void {
    if (this.project && this.form && !this.isFormInitialized) {
      if (!this.project.variablesDef)
        this.project.variablesDef = '[]';

      this.variablesCodeModel.value = this.project.variablesDef;

      let ciServiceControl = new FormControl();
      this.form.addControl('ciService', ciServiceControl);
      let control = new FormControl(this.project.variablesDef, [Validators.required, jsonValidator]);
      this.form.addControl('variablesDef', control);

      if (this.project.azureDevOps) {
        ciServiceControl.patchValue('azureDevOps');
        this.currentGroupName = 'azureDevOps';
        this.switchFormGroup().patchValue(this.project.azureDevOps);
      } else {
        ciServiceControl.patchValue('');
      }

      this.setCiServiceGroups(ciServiceControl);
      this.isFormInitialized = true;
    }
  }

  variablesDefChanged(value): void {
    let control = this.form.controls['variablesDef'];
    control.patchValue(value);
    control.markAsDirty();
  }
}
