import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatDividerModule, MatGridListModule, MatIconModule, MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ProcedureExecutionComponent } from './procedure-execution.component';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectComponent } from './project.component';
import { ProjectsComponent } from './projects.component';
import { RevisionComponent } from './revision.component';
import { StatusPipe } from './status.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule,
    MatTabsModule,
    FlexLayoutModule,
    RouterModule
  ],
  declarations: [
    StatusPipe,
    ProjectComponent,
    ProjectsComponent,
    RevisionComponent,
    ProcedureExecutionComponent,
    ProjectCreatorComponent
  ]
})
export class ProjectsModule { }
