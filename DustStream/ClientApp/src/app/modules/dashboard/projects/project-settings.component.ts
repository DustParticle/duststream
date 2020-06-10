import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { IProject } from '../models/project.model';
import { ProjectService } from './services';
import { CiServiceFormComponent } from './shared/ci-service-form.component';

@Component({
  selector: 'project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent {
  @ViewChild('ciServiceForm', { static: false }) private ciServiceForm: CiServiceFormComponent;
  ciFormGroup: FormGroup;

  public project: IProject;
  public projectName: string;
  public isGeneratingApiKey: boolean = false;
  public isUpdatingCiService: boolean = false;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
    private projectService: ProjectService, private clipboardService: ClipboardService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectName = params['projectName'];

      // Get title and component info
      this.projectService.getProject(this.projectName).subscribe((project: IProject) => {
        this.project = project;
      });
    });

    this.ciFormGroup = this.formBuilder.group({});
  }

  generateApiKey(): void {
    this.project.apiKey = '';
    this.isGeneratingApiKey = true;
    this.projectService.generateApiKey(this.projectName).subscribe((project: IProject) => {
      this.project = project;
    }, null, () => this.isGeneratingApiKey = false);
  }

  copyApiKeyToClipboard(): void {
    this.clipboardService.copyFromContent(this.project.apiKey);
    this.snackBar.open("The Api Key is copied to Clipboard!", null, { duration: 1000 });
  }

  updateCiService(): void {
    this.isUpdatingCiService = true;
    let request: IProject = Object.assign({}, this.project);
    request.azureDevOps = this.ciFormGroup.value.azureDevOps;
    request.variables = this.ciFormGroup.value.variables;
    this.projectService.updateCiService(request).subscribe((project: IProject) => {
      this.project = project;
      this.snackBar.open("The CI/CD Service is updated!", null, { duration: 1000 });
      this.ciFormGroup.markAsPristine();
    }, null, () => this.isUpdatingCiService = false);
  }
}
