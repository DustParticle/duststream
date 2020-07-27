import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule, MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { ProcedureExecutionComponent } from './procedure-execution.component';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectSettingsComponent } from './project-settings.component';
import { ProjectComponent } from './project.component';
import { ProjectsComponent } from './projects.component';
import { RevisionComponent } from './revision.component';
import { ProcedureService, ProjectService, RevisionService } from './services';
import { CiServiceFormComponent } from './shared/ci-service-form.component';
import { CreateReleaseComponent } from './shared/create-release.component';
import { NewBuildComponent } from './shared/new-build.component';
import { VariablesComponent } from './shared/variables.component';
import { StatusPipe } from './status.pipe';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
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
    VariablesComponent,
    CreateReleaseComponent,
    NewBuildComponent,
    ProjectComponent,
    ProjectsComponent,
    RevisionComponent,
    ProcedureExecutionComponent,
    ProjectCreatorComponent,
    ProjectSettingsComponent
  ],
  providers: [
    ProjectService,
    RevisionService,
    ProcedureService
  ],
  entryComponents: [
    CreateReleaseComponent,
    NewBuildComponent
  ]
})
export class ProjectsModule { }
