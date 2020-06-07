import { IVariable } from "./project.model";

export interface IRevision {
  projectName: string;
  revisionNumber: string;
  createdTime?: Date;
  timestamp?: Date;
  commitSet?: string;
  commitPayload?: string;
  description?: string;

  releaseStatus?: string;
  releaseLabel?: string;
  releaseNotes?: string;
  releaseDataLink?: string;

  [key: string]: any;
}

export interface ITriggerBuildRequest {
  branch: string;
  commit: string;
  variables: IVariable[];
}
