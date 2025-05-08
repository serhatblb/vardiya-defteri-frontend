// src/app/users/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'SISTEM_YONETICISI' | 'ISLETME_SORUMLUSU' | 'NORMAL_KULLANICI';

export interface UserDTO {
  id: number;
  sicil: string;
  ad: string;
  soyad: string;
  unvan: string;
  unite: string;
  rol: UserRole;
  hesapAcilisTarihi: string;
  hesapSilmeTarihi: string | null;
  silinmeNedeni: string | null;
  blokeMi: boolean;
  sonBlokeTarihi: string | null;
}

export interface CreateUserDTO {
  sicil: string;
  sifre: string;
  ad: string;
  soyad: string;
  unvan: string;
  unite: string;
  rol: UserRole;
}

export interface UpdateUserDTO {
  id: number;
  sicil: string;
  ad: string;
  soyad: string;
  unvan: string;
  unite: string;
  rol: UserRole;
  sifre?: string; // opsiyonel
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = '/api/users';

  constructor(private http: HttpClient) {}

  /** Tüm kullanıcıları getirir */
  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.base);
  }

  /** Filtreli kullanıcı listesini getirir (rapor için) */
  getFilteredUsers(filter: any): Observable<UserDTO[]> {
    return this.http.post<UserDTO[]>(`${this.base}/rapor`, filter);
  }

  /** Yeni kullanıcı oluşturur */
  create(dto: CreateUserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.base, dto);
  }

  /** Kullanıcıyı günceller */
  update(dto: UpdateUserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.base}/${dto.id}`, dto);
  }

  /** Kullanıcıyı soft-delete eder (silinme tarihi + neden) */
  softDelete(id: number, silinmeNedeni: string): Observable<string> {
    const url = `${this.base}/delete/${id}?silinmeNedeni=${encodeURIComponent(silinmeNedeni)}`;
    return this.http.put(url, null, { responseType: 'text' });
  }

  /** Kullanıcının bloke durumunu kaldırır */
  unblockUser(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/unblock`, {});
  }

  /** (Hazırlık için yerinde dursun) Aktif kullanıcıyı getirir */
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }
}
