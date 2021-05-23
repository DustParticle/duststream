import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule, MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CodeEditorModule } from '@ngstack/code-editor';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ClipboardModule } from 'ngx-clipboard';
import { ProcedureExecutionComponent } from './procedure-execution.component';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectSettingsComponent } from './project-settings.component';
import { ProjectComponent } from './project.component';
import { ProjectsComponent } from './projects.component';
import { RevisionComponent } from './revision.component';
import { ProcedureService, ProjectService, ReleaseService, RevisionService } from './services';
import { CiServiceFormComponent } from './shared/ci-service-form.component';
import { CreateReleaseComponent } from './shared/create-release.component';
import { NewBuildComponent } from './shared/new-build.component';
import { StatusPipe } from './status.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    CodeEditorModule.forRoot(),
    ClipboardModule,
    FormlyModule.forRoot({}),
    FormlyMaterialModule,
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
    CreateReleaseComponent,
    NewBuildComponent,
    ProjectComponent,
    ProjectsComponent,
    RevisionComponent,
    ProcedureExecutionComponent,
    ProjectCreatorComponent,
    ProjectSettingsComponent,
  ],
  providers: [
    ProjectService,
    RevisionService,
    ProcedureService,
    ReleaseService
  ],
  entryComponents: [
    CreateReleaseComponent,
    NewBuildComponent
  ]
})
export class ProjectsModule { }
