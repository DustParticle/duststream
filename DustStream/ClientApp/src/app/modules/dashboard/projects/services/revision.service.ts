import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRevision, ITriggerBuildRequest } from '../../models';

@Injectable()
export class RevisionService {
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  public getRevisionsByProject(projectName: string): Observable<IRevision[]> {
    return <Observable<IRevision[]>>this.http.get(`/api/revisions/projects/${projectName}`);
  }

  public getRevisionByProject(projectName: string, revisionNumber: string): Observable<IRevision> {
    return <Observable<IRevision>>this.http.get(`/api/revisions/projects/${projectName}/${revisionNumber}`);
  }

  public triggerBuildOnAzure(projectName: string, triggerBuildRequest: ITriggerBuildRequest): Observable<IRevision> {
    return <Observable<IRevision>>this.http.post(`/api/revisions/projects/${projectName}/trigger/azure`, triggerBuildRequest);
  }

  public createRelease(projectName: string, revisionNumber: string, releaseInfo: any): Observable<IRevision> {
    return <Observable<IRevision>>this.http.post(`/api/revisions/${revisionNumber}/projects/${projectName}/createRelease`, releaseInfo);
  }
}
