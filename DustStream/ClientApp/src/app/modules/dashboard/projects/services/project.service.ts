import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProject } from '../../models';

@Injectable()
export class ProjectService {
  public projectCreated: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  public getProjects(): Observable<IProject[]> {
    return <Observable<IProject[]>>this.http.get('/api/projects');
  }

  public getProject(projectName: string): Observable<IProject> {
    return <Observable<IProject>>this.http.get(`/api/projects/${projectName}`);
  }

  public createProject(project: any): Observable<IProject> {
    return <Observable<IProject>>this.http.post('/api/projects', project).pipe(
      map((value: any) => {
        this.projectCreated.emit();
        return value;
      }));
  }

  public generateApiKey(projectName: any): Observable<IProject> {
    return <Observable<IProject>>this.http.put(`/api/projects/${projectName}/generateApiKey`, '');
  }

  public updateCiService(project: any): Observable<IProject> {
    return <Observable<IProject>>this.http.put(`/api/projects/${project.name}/updateCiService`, project);
  }
}
