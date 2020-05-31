import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { IProcedureExecution } from '../models';
import { MatTableDataSource, MatTab } from '@angular/material';

@Component({
  selector: 'procedure-execution',
  templateUrl: './procedure-execution.component.html',
  styleUrls: ['./procedure-execution.component.scss']
})
export class ProcedureExecutionComponent implements OnInit {
  displayedColumns: string[];
  peDataSource: MatTableDataSource<IProcedureExecution>;

  @Input() projectName: string;
  @Input() revisionNumber: string;
  @Input() procedureShortName: string;

  public overallStatus: string;
  public procedureExecutions: IProcedureExecution[];

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
  }

  ngOnInit() {
      this.http.get('/api/procedures/' + this.procedureShortName + '/executions/projects/' + this.projectName + '/revisions/' + this.revisionNumber).subscribe((result: IProcedureExecution[]) => {
      this.procedureExecutions = result;
      this.updateCIConfigurationHeader();
      this.peDataSource = new MatTableDataSource<IProcedureExecution>(this.procedureExecutions);
    });
  }

  updateCIConfigurationHeader() {
    let ciConfigurationObj: object[] = [];

    this.displayedColumns = ['timestamp'];
    for (var i = 0; i < this.procedureExecutions.length; ++i) {
      var configurationObj = JSON.parse(this.procedureExecutions[i].ciConfiguration);
      ciConfigurationObj[i] = configurationObj;
      var keys = Object.keys(configurationObj);
      for (var j = 0; j < keys.length; ++j) {
        if (-1 === this.displayedColumns.indexOf(keys[j])) {
          this.displayedColumns.push(keys[i]);
        }
      }
    }

    for (var i = 0; i < this.procedureExecutions.length; ++i) {
      for (var j = 1; j < this.displayedColumns.length; ++j) {
        this.procedureExecutions[i][this.displayedColumns[j]] = ciConfigurationObj[i][this.displayedColumns[j]];
      }
      this.procedureExecutions[i]['actions'] = 'actions';
    }

    this.displayedColumns.push('status');
    this.displayedColumns.push('actions');
  }
}
