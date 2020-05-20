import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from './project.service';

@Component({
  selector: 'project',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.scss']
})
export class ProjectCreatorComponent {
  projectForm: FormGroup;
  createProjectError: string = "";
  isProjectCreated: boolean = false;

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
    this.projectService.createProject(project).subscribe((response) => {
      this.isProjectCreated = true;
    }, (error) => {
      this.createProjectError = error.error.message;
    });
  }
}
