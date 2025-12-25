import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VardiyaDTO {

  id?: number;
  userId: number;
  vardiyaType: VardiyaType;
  tarih: string;            // ISO format: "2025-04-17"
  notIcerik: string;
  saat?: string;
  olusturmaTarihi?: string;
  adSoyad?: string;
  unite?: string;
  guncellemeTarihi?: string;
}

export type VardiyaType =
  | 'SAAT_08_16'
  | 'SAAT_16_00'
  | 'SAAT_00_08'
  | 'SAAT_00_12'
  | 'SAAT_12_00';

export interface VardiyaFilter {
  vardiyaType?: VardiyaType | null;
  unite?: string | null;
  yazarAdSoyad?: string | null;
  baslangicTarihi?: string | null; // ISO format
  bitisTarihi?: string | null;
}

@Injectable({ providedIn: 'root' })
export class VardiyaService {
  private base = 'https://vardiya-defteri-backend.onrender.com/api/vardiyas';

  constructor(private http: HttpClient) {}

  listForUser(userId: number): Observable<VardiyaDTO[]> {
    return this.http.get<VardiyaDTO[]>(`${this.base}/user/${userId}`);
  }

  create(userId: number, dto: VardiyaDTO): Observable<VardiyaDTO> {
    return this.http.post<VardiyaDTO>(`${this.base}/${userId}`, dto);
  }

  getById(id: number): Observable<VardiyaDTO> {
    return this.http.get<VardiyaDTO>(`${this.base}/${id}`);
  }

  update(id: number, dto: VardiyaDTO): Observable<VardiyaDTO> {
    return this.http.put<VardiyaDTO>(`${this.base}/${id}`, dto);
  }

  listAll(): Observable<VardiyaDTO[]> {
    return this.http.get<VardiyaDTO[]>(this.base);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** 📊 Filtreli rapor isteği */
  getFiltered(filter: VardiyaFilter): Observable<VardiyaDTO[]> {
    return this.http.post<VardiyaDTO[]>(`${this.base}/rapor`, filter);
  }

  
}
