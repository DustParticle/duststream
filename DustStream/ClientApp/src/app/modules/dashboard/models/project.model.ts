export interface IAzureDevOpsSettings {
  url: string;
  username: string;
  accessToken: string;
}

export interface IProject {
  timestamp: Date;
  name: string;
  description: string;
  apiKey: string;

  azureDevOps?: IAzureDevOpsSettings;

  routerLink?: string[]
}
