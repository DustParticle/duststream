import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { RevisionComponent } from './revision.component';
import { ProcedureExecutionComponent } from './procedure-execution.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
    ProcedureExecutionComponent
  ]
})
export class ProjectModule { }
