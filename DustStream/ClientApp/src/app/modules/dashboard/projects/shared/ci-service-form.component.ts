import { Component, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { IProject } from '../../models';

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

  constructor() {
    this.groupNames.set('azureDevOps', ['organization', 'project', 'buildDefinition']);
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
      if (!this.project.variables)
        this.project.variables = [];

      let ciServiceControl = new FormControl();
      this.form.addControl('ciService', ciServiceControl);

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
}
