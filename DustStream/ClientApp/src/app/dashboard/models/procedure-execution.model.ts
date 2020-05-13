export interface IProcedureExecution {
  revisionNumber: string;
  jobId: string;
  procedureShortName: string;
  ciConfiguration: string;
  status: string;
  timestamp: Date;

  downloadLink: string;
  consoleLog: string;
  machine: string;
  description: string;

  isExpanded?: boolean;     // for frondend only
}
