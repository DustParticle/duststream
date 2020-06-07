import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAzureDevOpsSettings, IProject } from '../../models';

@Component({
  selector: 'ci-service-form',
  templateUrl: './ci-service-form.component.html',
  styleUrls: ['./ci-service-form.component.scss']
})
export class CiServiceFormComponent {
  @Input() project: IProject;
  @Input() form: FormGroup;
  isFormInitialized: boolean = false;

  azureControlNames = ['azureOrganization', 'azureProject',
    'azureUsername', 'azurePersonalAccessToken',
    'azureBuildDefinition'];

  azureDevOpsSettings: IAzureDevOpsSettings = {
    organization: '',
    project: '',
    username: '',
    accessToken: '',
    buildDefinition: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  setCiServiceValidators(): void {
    let ciServiceControl = this.form.get('ciService');
    if (this.project.azureDevOps) {
      this.azureDevOpsSettings = this.project.azureDevOps;
      ciServiceControl.setValue('AzureDevOps');
    } else {
      ciServiceControl.setValue('');
    }

    ciServiceControl.valueChanges.subscribe(ciService => {
      if (ciService === 'AzureDevOps') {
        this.azureControlNames.forEach(controlName => this.form.get(controlName).setValidators([Validators.required]));
        if (this.project)
          this.project.azureDevOps = this.azureDevOpsSettings;
      } else if (ciService === '') {
        this.azureControlNames.forEach(controlName => this.form.get(controlName).setValidators(null));
        if (this.project)
          delete this.project.azureDevOps;
      }
      this.azureControlNames.forEach(controlName => this.form.get(controlName).updateValueAndValidity());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  initializeForm(): void {
    if (this.project && this.form && !this.isFormInitialized) {
      if (!this.project.variables)
        this.project.variables = [];

      this.form.addControl('ciService', new FormControl());
      this.azureControlNames.forEach(controlName => this.form.addControl(controlName, new FormControl()));

      this.setCiServiceValidators();
      this.isFormInitialized = true;
    }
  }
}
