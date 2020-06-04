import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatStepper } from '@angular/material';
import { ClipboardService } from 'ngx-clipboard';
import { IAzureDevOpsSettings, IProject } from '../models';
import { ProjectService } from './project.service';
import { CiServiceFormComponent } from './forms/ci-service-form.component';

enum CreateStatus {
  None,
  Creating,
  Created,
  Error
}

@Component({
  selector: 'project-creator',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.scss']
})
export class ProjectCreatorComponent {
  CreateStatus = CreateStatus;
  @ViewChild('stepper', { static: false }) private stepper: MatStepper;
  @ViewChild('ciServiceForm', { static: false }) private ciServiceForm: CiServiceFormComponent;

  projectInfoFormGroup: FormGroup;
  ciFormGroup: FormGroup;
  createProjectError: string = '';
  apiKey: string;
  status: CreateStatus = CreateStatus.None;

  project: IProject = {
    timestamp: new Date(),
    name: '',
    description: '',
    apiKey: ''
  };
  azureDevOpsSettings: IAzureDevOpsSettings = {
    url: '',
    username: '',
    accessToken: ''
  };

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService,
    private clipboardService: ClipboardService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.projectInfoFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.ciFormGroup = this.formBuilder.group({
      ciService: [''],
      azureProjectUrl: [''],
      azureUsername: [''],
      azurePersonalAccessToken: ['']
    });

    this.setCiServiceValidators();
  }

  ngAfterViewInit(): void {
    this.ciFormGroup = this.ciServiceForm.ciFormGroup;
  }

  createProject(): void {
    this.stepper.next();
    this.status = CreateStatus.Creating;
    this.projectService.createProject(this.project).subscribe((response: IProject) => {
      this.project = response;
      this.status = CreateStatus.Created;
    }, (error) => {
      this.createProjectError = error.error ? error.error.message : 'Unknown error';
      this.status = CreateStatus.Error;
    });
  }

  copyApiKeyToClipboard(): void {
    this.clipboardService.copyFromContent(this.project.apiKey);
    this.snackBar.open('The Api Key is copied to Clipboard!', null, { duration: 1000 });
  }

  setCiServiceValidators() {
    let azureProjectUrlControl = this.ciFormGroup.get('azureProjectUrl');
    const azureControls = [azureProjectUrlControl, this.ciFormGroup.get('azureUsername'), this.ciFormGroup.get('azurePersonalAccessToken')];

    this.ciFormGroup.get('ciService').valueChanges.subscribe(ciService => {
      if (ciService === 'AzureDevOps') {
        azureControls.forEach(control => { control.setValidators([Validators.required]) });
        azureProjectUrlControl.setValidators([Validators.required, Validators.pattern(/https:\/\/dev.azure.com\/\b([-a-zA-Z0-9@:%_\+.~#?&=]*)\/\b([-a-zA-Z0-9@:%_\+.~#?&=]*)$/)]);
        this.project.azureDevOps = this.azureDevOpsSettings;
      } else if (ciService === '') {
        azureControls.forEach(control => control.setValidators(null));
        delete this.project.azureDevOps;
      }
      azureControls.forEach(control => control.updateValueAndValidity());
    });
  }
}
