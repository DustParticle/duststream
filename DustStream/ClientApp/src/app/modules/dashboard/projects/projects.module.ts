import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule, MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { CiServiceFormComponent } from './forms/ci-service-form.component';
import { ProcedureExecutionComponent } from './procedure-execution.component';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectSettingsComponent } from './project-settings.component';
import { ProjectComponent } from './project.component';
import { ProjectService } from './project.service';
import { ProjectsComponent } from './projects.component';
import { RevisionComponent } from './revision.component';
import { StatusPipe } from './status.pipe';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    StatusPipe,
    CiServiceFormComponent,
    ProjectComponent,
    ProjectsComponent,
    RevisionComponent,
    ProcedureExecutionComponent,
    ProjectCreatorComponent,
    ProjectSettingsComponent
  ],
  providers: [
    ProjectService
  ]
})
export class ProjectsModule { }
