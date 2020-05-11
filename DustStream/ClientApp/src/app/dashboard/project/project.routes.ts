import { Routes } from '@angular/router';

import { ProjectComponent } from './project.component';
import { RevisionComponent } from './revision.component';

export const ProjectRoutes: Routes = [
  {
    path: 'projects/:projectName',
    component: ProjectComponent,
    data: {
      title: ''
    }
  },
  {
    path: 'projects/:projectName/:revisionNumber',
    component: RevisionComponent,
    data: {
      title: ''
    }
  }
];
