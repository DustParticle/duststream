import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { IProject } from '../models';

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
  private isShowingProjects: boolean = false;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string,
    private sidebarService: SidebarService, private authService: MsAdalAngular6Service,
    private router: Router) {
    router.events.subscribe((url: any) => this.onUrlChanged());
    this.onUrlChanged();
  }

  ngOnInit() {
    this.http.get('/api/projects').subscribe((projects: IProject[]) => {
      this.projects = projects;

      this.sidebarService.clear();
      for (var i = 0; i < this.projects.length; ++i) {
        this.projects[i].routerLink = ['/projects/view/' + this.projects[i].name];
        this.projects[i].description = "description description";
        this.sidebarService.addItem(this.projects[i].name, this.projects[i].routerLink);
      }
    });
  }

  onUrlChanged() {
    this.isShowingProjects = (this.router.url === '/projects');
  }
}
