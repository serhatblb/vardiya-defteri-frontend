import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardDTO } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(this.baseUrl);
  }
}
