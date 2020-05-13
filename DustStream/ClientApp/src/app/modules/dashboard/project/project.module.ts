import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcedureExecutionComponent } from './procedure-execution.component';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectComponent } from './project.component';
import { RevisionComponent } from './revision.component';
import { StatusPipe } from './status.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    StatusPipe,
    ProjectComponent,
    RevisionComponent,
    ProcedureExecutionComponent,
    ProjectCreatorComponent
  ]
})
export class ProjectModule { }
