import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { IProject } from '../models';
import { ProjectService } from './services';

/**
 * This is a part of the component FullLayoutComponent got from theme
 */
@Component({
  selector: 'projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private projects: IProject[];
  public isShowingProjects: boolean = false;

  constructor(private projectService: ProjectService,
    private sidebarService: SidebarService, private authService: MsAdalAngular6Service,
    private router: Router) {
    router.events.subscribe((url: any) => this.onUrlChanged());
    this.onUrlChanged();
  }

  ngOnInit() {
    this.loadProjects();
    this.projectService.projectCreated.subscribe(() => this.loadProjects());
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects: IProject[]) => {
      this.projects = projects;

      this.sidebarService.clear();
      for (var i = 0; i < this.projects.length; ++i) {
        this.projects[i].routerLink = ['/projects/view/' + this.projects[i].name];
        this.sidebarService.addItem(this.projects[i].name, this.projects[i].routerLink);
      }
    });
  }

  onUrlChanged() {
    this.isShowingProjects = (this.router.url === '/projects');
  }
}
