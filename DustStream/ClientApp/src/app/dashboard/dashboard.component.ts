import { Component, Inject, OnInit } from '@angular/core';
import { SidebarItem } from './shared/index';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IProject } from './models';

/**
 * This is a part of the component FullLayoutComponent got from theme
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  sidebarItems: SidebarItem[];
  private projects: IProject[];

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  ngOnInit() {
    this.http.get('/api/projects').subscribe((projects: IProject[]) => {
      this.projects = projects;

      this.sidebarItems = [];
      for (var i = 0; i < this.projects.length; ++i) {
        this.sidebarItems.push({
          name: this.projects[i].name,
          iconClass: 'icon-layers',
          routerLink: ['/dashboard/projects/' + this.projects[i].name]
        });
      }
    });
  }
}
