import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRevision, ITriggerBuildRequest } from '../../models';

@Injectable()
export class RevisionService {
  public newBuildTriggered: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  public getRevisionsByProject(projectName: string): Observable<IRevision[]> {
    return <Observable<IRevision[]>>this.http.get(`/api/revisions/projects/${projectName}`);
  }

  public getRevisionByProject(projectName: string, revisionNumber: string): Observable<IRevision> {
    return <Observable<IRevision>>this.http.get(`/api/revisions/projects/${projectName}/${revisionNumber}`);
  }

  public triggerBuildOnAzure(projectName: string, triggerBuildRequest: ITriggerBuildRequest): Observable<IRevision> {
    return <Observable<IRevision>>this.http.post(`/api/revisions/projects/${projectName}/trigger/azure`, triggerBuildRequest).pipe(
      map((value: any) => {
        this.newBuildTriggered.emit();
        return value;
      }));
  }
}
