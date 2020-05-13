import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';
import { IProject } from './models';

/**
 * This is a part of the component FullLayoutComponent got from theme
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private projects: IProject[];

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private sidebarService: SidebarService) {
  }

  ngOnInit() {
    this.http.get('/api/projects').subscribe((projects: IProject[]) => {
      this.projects = projects;

      this.sidebarService.clear();
      for (var i = 0; i < this.projects.length; ++i) {
        this.sidebarService.addItem(this.projects[i].name, ['/dashboard/projects/' + this.projects[i].name]);
      }
    });
  }
}
