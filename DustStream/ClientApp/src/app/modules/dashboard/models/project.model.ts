export interface IAzureDevOpsSettings {
  organization: string;
  project: string;
  buildDefinition: string;
  releaseDefinition: string;
  artifactResourcePipeline: string;
}

export interface IVariable {
  key: string;
  value: string;
}

export interface IProject {
  timestamp: Date;
  name: string;
  description: string;
  apiKey: string;
  azureDevOps?: IAzureDevOpsSettings;
  variables: IVariable[];

  routerLink?: string[];      // For frontend only
}
