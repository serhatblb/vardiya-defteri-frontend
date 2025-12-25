// src/app/services/settings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private http: HttpClient) {}

  /** Oturum gerektirmeyen endpoint’e yöneliyor */
  getSettings(): Observable<{ maxFailedAttempts: string }> {
    return this.http.get<{ maxFailedAttempts: string }>('/api/settings/public');
  }
}
