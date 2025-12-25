// role.service.ts (aynı kaldı, ek güncelleme gerek yok)
import { Injectable } from '@angular/core';

export type UserRole =
  | 'SISTEM_YONETICISI'
  | 'ISLETME_SORUMLUSU'
  | 'NORMAL_KULLANICI';

@Injectable({ providedIn: 'root' })
export class RoleService {
  getUserRole(): UserRole | null {
    const token = localStorage.getItem('token');
    if (!token) return localStorage.getItem('rol') as UserRole | null;
    try {
      const data: any = JSON.parse(atob(token.split('.')[1]));
      return (data.rol as UserRole) ?? (localStorage.getItem('rol') as UserRole | null);
    } catch {
      return localStorage.getItem('rol') as UserRole | null;
    }
  }

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      return Number(payload.id);
    } catch {
      return null;
    }
  }

  logTokenPayload(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🧪 Token yok');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🧪 JWT payload:', payload);
    } catch (e) {
      console.error('JWT parse hatası:', e);
    }
  }
}
