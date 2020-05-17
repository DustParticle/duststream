import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProjectsModule } from './projects/projects.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProjectsModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
