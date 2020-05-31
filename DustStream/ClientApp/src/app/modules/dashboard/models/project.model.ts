export interface IProject {
  domainString: string;
  timestamp: Date;
  name: string;
  description: string;
  apiKey: string;

  routerLink?: string[]
}
