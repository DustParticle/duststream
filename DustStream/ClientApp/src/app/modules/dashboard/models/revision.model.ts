export interface IRevision {
  projectName: string;
  revisionNumber: string;
  createdTime?: Date;
  timestamp?: Date;
  commitSet?: string;
  commitPayload?: string;
  description?: string;
  requestor?: string;

  [key: string]: any;
}

export interface IVariable {
  key: string;
  value: string;
}

export interface ITriggerBuildRequest {
  branch: string;
  commit: string;
  variables: IVariable[];
}
