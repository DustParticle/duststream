import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProcedure, IRevision } from '../models';

@Component({
  selector: 'revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent {
  public revisionInfo: IRevision;
  public procedures: IProcedure[];

  public revisionCommitPayload: object;

  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let projectName = params['projectName'];
      let revisionNumber = params['revisionNumber'];
      this.revisionInfo = {
        projectName: projectName,
        revisionNumber: revisionNumber
      };

      // Get revision info
      this.http.get('/api/revisions/projects/' + projectName + '/' + revisionNumber).subscribe((revisionInfo: IRevision) => {
        this.revisionInfo = revisionInfo;

        if (0 !== Object.keys(revisionInfo).length) {
          this.revisionCommitPayload = JSON.parse(this.revisionInfo.commitPayload);
        }
      });

      this.http.get('/api/procedures/projects/' + this.revisionInfo.projectName).subscribe((result: IProcedure[]) => {
        this.procedures = result;

        // Sort procedures by Created Time, ascending
        this.procedures.sort(function (a, b) {
          let left = a.createdTime;
          let right = b.createdTime;
          return (left > right ? 1 : left < right ? -1 : 0);
        });
      });
    });
  }
}
