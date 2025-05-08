import { InjectionToken } from '@angular/core';

export interface AppConfig { apiUrl: string; }

export const APP_CONFIG = new InjectionToken<AppConfig>(
  'app.config',
  {
    providedIn: 'root',
    factory: () => ({ apiUrl: 'http://localhost:8080/api' })
  }
);

// Böyle de export edebilirsiniz, ama factory yeterli.
export const AppConfigValue: AppConfig = {
  apiUrl: 'http://localhost:8080/api'
};
