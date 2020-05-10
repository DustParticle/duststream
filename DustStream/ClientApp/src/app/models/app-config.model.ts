export interface IAppConfig {
  env: {
    name: string;
  };
  adal: {
    tenant: string;
    clientId: string;
    endpoints: {
      api: string;
    };
    navigateToLoginRequestUrl: boolean;
    cacheLocation: string;
  };
}
