import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject } from '../models';
import { ProjectService } from './project.service';

@Component({
  selector: 'project',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.scss']
})
export class ProjectCreatorComponent {
  projectForm: FormGroup;
  createProjectError: string = "";
  project: IProject;
  apiKey: string;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  hasError(controlName: string, errorName: string): any {
    return this.projectForm.controls[controlName].hasError(errorName);
  }

  createProject(project: any): void {
    this.createProjectError = "";
    this.projectService.createProject(project).subscribe((response: IProject) => {
      this.project = response;
    }, (error) => {
      this.createProjectError = error.error.message;
    });
  }
}
