import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { IProject } from '../models/project.model';
import { CiServiceFormComponent } from './forms/ci-service-form.component';
import { ProjectService } from './project.service';

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

  constructor(private route: ActivatedRoute, private projectService: ProjectService,
    private clipboardService: ClipboardService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectName = params['projectName'];

      // Get title and component info
      this.projectService.getProject(this.projectName).subscribe((project: IProject) => {
        this.project = project;
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.ciFormGroup = this.ciServiceForm.ciFormGroup);
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
    console.log(this.project);
    this.projectService.updateCiService(this.project).subscribe((project: IProject) => {
      this.project = project;
      this.snackBar.open("The CI/CD Service is updated!", null, { duration: 1000 });
      this.ciFormGroup.markAsPristine();
    }, null, () => this.isUpdatingCiService = false);
  }
}
