import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProcedure, IProcedureExecution } from '../../models';

@Injectable()
export class ProcedureService {
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  public getProceduresByProject(projectName: string): Observable<IProcedure[]> {
    return <Observable<IProcedure[]>>this.http.get(`/api/procedures/projects/${projectName}`);
  }

  public getProceduresStatusByRevision(projectName: string, revisionNumber: string, procedure: string): Observable<string> {
    return <Observable<string>>this.http.get(`/api/procedures/${procedure}/executions/projects/${projectName}/revisions/${revisionNumber}/status`);
  }

  public getProceduresByRevision(projectName: string, revisionNumber: string, procedure: string): Observable<IProcedureExecution[]> {
    return <Observable<IProcedureExecution[]>>this.http.get(`/api/procedures/${procedure}/executions/projects/${projectName}/revisions/${revisionNumber}`);
  }
}
