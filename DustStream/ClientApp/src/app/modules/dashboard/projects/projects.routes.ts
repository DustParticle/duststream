import { Routes } from '@angular/router';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectSettingsComponent } from './project-settings.component';
import { ProjectComponent } from './project.component';
import { ProjectsComponent } from './projects.component';
import { RevisionComponent } from './revision.component';

export const ProjectsRoutes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { title: 'Projects' },
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'create',
        component: ProjectCreatorComponent,
        data: { title: 'New Project' }
      },
      {
        path: 'view/:projectName',
        component: ProjectComponent,
        data: { title: 'Project Details' }
      },
      {
        path: 'view/:projectName/:revisionNumber',
        component: RevisionComponent,
        data: { title: 'Revision Details' }
      },
      {
        path: 'settings/:projectName',
        component: ProjectSettingsComponent,
        data: { title: 'Project Settings' }
      }
    ]
  }
];
