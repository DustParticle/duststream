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

  azureDevOpsSettings: IAzureDevOpsSettings = {
    url: '',
    username: '',
    accessToken: '',
    buildDefinition: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  setCiServiceValidators(): void {
    let azureProjectUrlControl = this.form.get('azureProjectUrl');
    const azureControls = [azureProjectUrlControl, this.form.get('azureUsername'),
      this.form.get('azurePersonalAccessToken'), , this.form.get('azureBuildDefinition')];

    let ciServiceControl = this.form.get('ciService');
    if (this.project.azureDevOps) {
      this.azureDevOpsSettings = this.project.azureDevOps;
      ciServiceControl.setValue('AzureDevOps');
    } else {
      ciServiceControl.setValue('');
    }
    ciServiceControl.valueChanges.subscribe(ciService => {
      if (ciService === 'AzureDevOps') {
        azureControls.forEach(control => { control.setValidators([Validators.required]) });
        azureProjectUrlControl.setValidators([Validators.required, Validators.pattern(/https:\/\/dev.azure.com\/\b([-a-zA-Z0-9@:%_\+.~#?&=]*)\/\b([-a-zA-Z0-9@:%_\+.~#?&=]*)$/)]);
        if (this.project)
          this.project.azureDevOps = this.azureDevOpsSettings;
      } else if (ciService === '') {
        azureControls.forEach(control => control.setValidators(null));
        if (this.project)
          delete this.project.azureDevOps;
      }
      azureControls.forEach(control => control.updateValueAndValidity());
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
      this.form.addControl('azureProjectUrl', new FormControl());
      this.form.addControl('azureUsername', new FormControl());
      this.form.addControl('azurePersonalAccessToken', new FormControl());
      this.form.addControl('azureBuildDefinition', new FormControl());

      this.setCiServiceValidators();
      this.isFormInitialized = true;
    }
  }
}
