import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAzureDevOpsSettings, IProject } from '../../models';

@Component({
  selector: 'ci-service-form',
  templateUrl: './ci-service-form.component.html',
  styleUrls: ['./ci-service-form.component.scss']
})
export class CiServiceFormComponent {
  @Input() project: IProject;
  ciFormGroup: FormGroup;

  azureDevOpsSettings: IAzureDevOpsSettings = {
    url: '',
    username: '',
    accessToken: ''
  };

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.ciFormGroup = this.formBuilder.group({
      ciService: [''],
      azureProjectUrl: [''],
      azureUsername: [''],
      azurePersonalAccessToken: ['']
    });

    this.setCiServiceValidators();
    this.updateCiServiceValue();
  }

  setCiServiceValidators(): void {
    let azureProjectUrlControl = this.ciFormGroup.get('azureProjectUrl');
    const azureControls = [azureProjectUrlControl, this.ciFormGroup.get('azureUsername'), this.ciFormGroup.get('azurePersonalAccessToken')];

    this.ciFormGroup.get('ciService').valueChanges.subscribe(ciService => {
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
    this.updateCiServiceValue();
  }

  updateCiServiceValue(): void {
    if (this.project && this.ciFormGroup) {
      if (this.project.azureDevOps) {
        this.azureDevOpsSettings = this.project.azureDevOps;
        this.ciFormGroup.get('ciService').setValue('AzureDevOps');
      }
    }
  }
}
