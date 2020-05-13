import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProjectModule } from './project/project.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProjectModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
