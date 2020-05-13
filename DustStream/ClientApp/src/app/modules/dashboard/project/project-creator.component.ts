import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProcedure, IRevision } from '../models';
import { IProject } from '../models/project.model';

@Component({
  selector: 'project',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.scss']
})
export class ProjectCreatorComponent {
  constructor() {
  }

  ngOnInit(): void {
  }
}
