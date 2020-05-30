import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '../models/project.model';
import { ProjectService } from './project.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent {
  public project: IProject;
  public projectName: string;
  public isGeneratingApiKey: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('BASE_URL') baseUrl: string,
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
}
