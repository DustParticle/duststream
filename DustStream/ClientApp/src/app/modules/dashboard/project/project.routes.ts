import { Routes } from '@angular/router';

import { ProjectComponent } from './project.component';
import { RevisionComponent } from './revision.component';
import { ProjectCreatorComponent } from './project-creator.component';

export const ProjectRoutes: Routes = [
  {
    path: 'projects/create',
    component: ProjectCreatorComponent,
    data: {
      title: 'New Project'
    }
  },
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
