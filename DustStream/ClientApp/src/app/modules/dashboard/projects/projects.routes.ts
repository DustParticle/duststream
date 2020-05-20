import { Routes } from '@angular/router';
import { ProjectCreatorComponent } from './project-creator.component';
import { ProjectComponent } from './project.component';
import { ProjectsComponent } from './projects.component';
import { RevisionComponent } from './revision.component';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

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
        path: 'projects/view/:projectName/:revisionNumber',
        component: RevisionComponent,
        data: { title: 'Revision Details' }
      }
    ]
  }
];
