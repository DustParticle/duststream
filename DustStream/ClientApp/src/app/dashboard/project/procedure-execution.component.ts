import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { IProcedureExecution } from '../models';

@Component({
  selector: 'procedure-execution',
  templateUrl: './procedure-execution.component.html',
  styleUrls: ['./procedure-execution.component.css']
})
export class ProcedureExecutionComponent implements OnInit {
  @Input() projectName: string;
  @Input() revisionNumber: string;
  @Input() procedureShortName: string;

  public overallStatus: string;
  public procedureExecutions: IProcedureExecution[];
  public ciConfigurationHeader: string[];
  public ciConfigurationObj: object[];

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  ngOnInit() {
    this.http.get('/api/procedures/' + this.procedureShortName + '/executions/projects/' + this.projectName + '/revisions/' + this.revisionNumber + '/status').subscribe((result: string) => {
      this.overallStatus = result;
    });

    this.http.get('/api/procedures/' + this.procedureShortName + '/executions/projects/' + this.projectName + '/revisions/' + this.revisionNumber).subscribe((result: IProcedureExecution[]) => {
      this.procedureExecutions = result;
      this.procedureExecutions.forEach(execution => execution.isExpanded = false);
      this.updateCIConfigurationHeader();
    });
  }

  selectRow(execution: IProcedureExecution) {
    execution.isExpanded = !execution.isExpanded;
  }

  updateCIConfigurationHeader() {
    this.ciConfigurationHeader = [];
    this.ciConfigurationObj = [];

    for (var i = 0; i < this.procedureExecutions.length; ++i) {
      var configurationObj = JSON.parse(this.procedureExecutions[i].ciConfiguration);
      this.ciConfigurationObj[this.procedureExecutions[i].jobId] = configurationObj;
      var keys = Object.keys(configurationObj);
      for (var j = 0; j < keys.length; ++j) {
        if (-1 === this.ciConfigurationHeader.indexOf(keys[j])) {
          this.ciConfigurationHeader.push(keys[j]);
        }
      }
    }
  }
}
