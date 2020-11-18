import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { IProcedureExecution } from '../models';
import { ProcedureService } from './services';
import { SignalRService } from '../../../services/signal-r.service';

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

  public procedureExecutions: IProcedureExecution[];

  constructor(private procedureService: ProcedureService, private signalRService: SignalRService) {
  }

  ngOnInit() {
    this.procedureService.getProceduresByRevision(this.projectName, this.revisionNumber, this.procedureShortName).subscribe((result: IProcedureExecution[]) => {
      this.procedureExecutions = result;
      this.updateCIConfigurationHeader();
      this.peDataSource = new MatTableDataSource<IProcedureExecution>(this.procedureExecutions);
    });

    this.signalRService.updateProcedureExecutionStatusTriggered.subscribe((data) => this.updateProcedureExecutionStatus(data));
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

  updateProcedureExecutionStatus(data): void {
    // Only update value when the current page is identical with received object
    let procedureExecution: IProcedureExecution = data.procedureExecution;
    if (this.projectName === data.projectName && this.revisionNumber === procedureExecution.revisionNumber) {
      Object.assign(this.procedureExecutions.find(procedureEntry => procedureEntry.jobId === procedureExecution.jobId) || {}, { status: procedureExecution.status });
    }
  }
}
