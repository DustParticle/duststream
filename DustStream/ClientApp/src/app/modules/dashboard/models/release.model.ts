export interface IRelease {
  projectName: string;
  revisionNumber: string;
  status: string;
  releaseLabel?: string;
  releaseNotes?: string;
  releaseDataLink?: string;
}

export interface ICreateReleaseRequest {
  name: string;
  releaseNotes: string;
}
