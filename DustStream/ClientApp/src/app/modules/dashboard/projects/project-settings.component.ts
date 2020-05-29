import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent {
  public project: IProject;
  public projectName: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private projectService: ProjectService) {
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
    this.projectService.generateApiKey(this.projectName).subscribe((project: IProject) => {
      this.project = project;
    });
  }
}
