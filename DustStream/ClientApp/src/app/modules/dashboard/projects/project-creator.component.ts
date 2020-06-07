import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatStepper } from '@angular/material';
import { ClipboardService } from 'ngx-clipboard';
import { IProject } from '../models';
import { ProjectService } from './services';
import { CiServiceFormComponent } from './shared/ci-service-form.component';

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
    apiKey: '',
    variables: []
  };

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService,
    private clipboardService: ClipboardService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.projectInfoFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.ciFormGroup = this.formBuilder.group({});
  }

  createProject(): void {
    console.log(this.project);
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
}
