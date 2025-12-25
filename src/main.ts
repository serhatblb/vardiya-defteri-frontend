// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }       from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { AppComponent }    from './app/app.component';
import { appRoutes }       from './app/app.routes';
import localeTr from '@angular/common/locales/tr';

import { AuthInterceptor } from './app/auth/auth.interceptor';
registerLocaleData(localeTr);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'tr-TR' } 
  ]
}).catch(err => console.error(err));
