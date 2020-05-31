import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectService {
  public projectCreated: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  public getProjects(): Observable<object> {
    return this.http.get('/api/projects');
  }

  public getProject(projectName: string): Observable<object> {
    return this.http.get('/api/projects/' + projectName);
  }

  public createProject(project: any): Observable<object> {
    return this.http.post('/api/projects', project).pipe(
      map((value: any) => {
        this.projectCreated.emit();
        return value;
      }));
  }

  public generateApiKey(projectName: any): Observable<object> {
    return this.http.put('/api/projects/' + projectName + '/generateApiKey', '');
  }
}
