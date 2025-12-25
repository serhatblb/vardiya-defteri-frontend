// src/app/services/auth.service.ts
import { Injectable }        from '@angular/core';
import { HttpClient }        from '@angular/common/http';
import { Observable }        from 'rxjs';

export interface AuthRequest {
  sicil: string;
  sifre: string;
}

export interface AuthResponse {
  token: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = 'https://vardiya-defteri-backend.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, req);
  }
}
