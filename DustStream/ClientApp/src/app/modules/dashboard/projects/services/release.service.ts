import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRelease, ICreateReleaseRequest } from '../../models';

@Injectable()
export class ReleaseService {
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  public getReleasesByProject(projectName: string): Observable<IRelease[]> {
    return <Observable<IRelease[]>>this.http.get(`/api/releases/projects/${projectName}`);
  }

  public getReleaseByProject(projectName: string, revisionNumber: string): Observable<IRelease> {
    return <Observable<IRelease>>this.http.get(`/api/releases/projects/${projectName}/revisions/${revisionNumber}`);
  }

  public createRelease(projectName: string, revisionNumber: string, releaseInfo: ICreateReleaseRequest): Observable<IRelease> {
    return <Observable<IRelease>>this.http.post(`/api/releases/projects/${projectName}/revisions/${revisionNumber}/createRelease`, releaseInfo);
  }
}
