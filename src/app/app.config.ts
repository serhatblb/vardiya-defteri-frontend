import { InjectionToken } from '@angular/core';

export interface AppConfig { apiUrl: string; }

export const APP_CONFIG = new InjectionToken<AppConfig>(
  'app.config',
  {
    providedIn: 'root',
    factory: () => ({ apiUrl: 'https://vardiya-defteri-backend.onrender.com/api' })
  }
);

// Böyle de export edebilirsiniz, ama factory yeterli.
export const AppConfigValue: AppConfig = {
  apiUrl: 'https://vardiya-defteri-backend.onrender.com/api'
};
