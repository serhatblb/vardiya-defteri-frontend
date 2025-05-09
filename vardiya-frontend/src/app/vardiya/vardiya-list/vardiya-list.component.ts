// src/app/vardiya/vardiya-list/vardiya-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

import { VardiyaService, VardiyaDTO, VardiyaType } from '../../services/vardiya.service';
import { RoleService } from '../../services/role.service';
import { VardiyaDetayDialogComponent } from '../vardiya-detay-dialog/vardiya-detay-dialog.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver-es';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-vardiya-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './vardiya-list.component.html',
  styleUrls: ['./vardiya-list.component.scss']
})
export class VardiyaListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<VardiyaDTO>();
  displayedColumns = ['tarih', 'saat', 'vardiyaType', 'adSoyad', 'unite', 'notIcerik', 'actions'];

  unitList: string[] = [
    'KOKHANE','YUKSEK_FIRIN','KONVERTOR','HADDEHANE',
    'ENERJI','LABORATUVAR','BAKIM','MÜHENDİSLİK','KALİTE','INSAN_KAYNAKLARI'
  ];
  selectedUnit: string = '';
  selectedType: VardiyaType | '' = '';
  searchText = '';
  searchTextChanged = new Subject<string>();
  error = '';
  baslangicTarihi: Date | null = null;
  bitisTarihi: Date | null = null;
  kullaniciRol = '';

  pagedData: VardiyaDTO[] = [];
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput') searchInput!: any;

  constructor(
    private svc: VardiyaService,
    private roleSvc: RoleService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.kullaniciRol = this.roleSvc.getUserRole() || '';
    this.loadFiltered();
    this.searchTextChanged.pipe(debounceTime(300)).subscribe(() => this.loadFiltered());
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }

  loadFiltered(): void {
  const filter = {
    yazarAdSoyad: this.searchText || null,
    unite: this.selectedUnit || null,
    vardiyaType: this.selectedType || null,
    baslangicTarihi: this.baslangicTarihi ? this.baslangicTarihi.toISOString().split('T')[0] : null,
    bitisTarihi: this.bitisTarihi ? this.bitisTarihi.toISOString().split('T')[0] : null
  };

  this.svc.getFiltered(filter).subscribe({
    next: data => {
      this.dataSource.data = data;
      this.pagedData = data; // burada tüm veri geliyor, arama için hazırla
    },
    error: () => this.error = 'Veri yüklenemedi.'
  });
}


  setPage(index: number): void {
    this.currentPage = index;
    const start = index * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.dataSource.filteredData.slice(start, end);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.setPage(event.pageIndex);
  }

  onSearchChange(txt: string): void {
  const search = txt.trim().toLowerCase();
  this.pagedData = this.dataSource.data.filter(v =>
    (v.notIcerik?.toLowerCase().includes(search) || '') ||
    (v.adSoyad?.toLowerCase().includes(search) || '') ||
    (v.unite?.toLowerCase().includes(search) || '')
  );
}


  clearAllFilters(): void {
    this.searchText = '';
    this.selectedUnit = '';
    this.selectedType = '';
    this.baslangicTarihi = null;
    this.bitisTarihi = null;
    this.loadFiltered();
  }

  excelAktar(): void {
    const exportData = this.dataSource.filteredData.map(v => ({
      Tarih: v.tarih,
      Saat: v.saat,
      'Vardiya Tipi': v.vardiyaType,
      Ünvan: v.unite,
      'Yazan Kişi': v.adSoyad,
      Not: v.notIcerik
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = { Sheets: { 'Vardiya Raporu': ws }, SheetNames: ['Vardiya Raporu'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'vardiya_raporu.xlsx');
  }

  pdfAktar(): void {
    const now = new Date().toLocaleString('tr-TR');
    const filtreBilgisi = `
      <div>
        <h2>Vardiya Raporu</h2>
        <p>Rapor Tarihi: ${now}</p>
        <p>Filtre: ${this.searchText || 'Yok'}, Ünite: ${this.selectedUnit || 'Tümü'}, Vardiya: ${this.selectedType || 'Tümü'}</p>
        <br/>
      </div>
    `;
    const tablo = this.dataSource.filteredData.map(v => `
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed #ccc;">
        <strong>${v.tarih} - ${v.saat}</strong><br/>
        <strong>Tip:</strong> ${v.vardiyaType}<br/>
        <strong>Ekleyen:</strong> ${v.adSoyad}<br/>
        <strong>Ünite:</strong> ${v.unite}<br/>
        <strong>Not:</strong> ${v.notIcerik}
      </div>
    `).join('');

    const html = `<div style='font-family: Arial;'>${filtreBilgisi}${tablo}</div>`;

    html2pdf().from(html).set({
      margin: 0.5,
      filename: 'vardiya_raporu.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }).save();
  }

  onEdit(id?: number): void {
    if (id != null) this.router.navigate(['/vardiya-form', id]);
  }

  onDelete(id?: number): void {
    if (id != null && confirm('Bu notu silmek istediğinize emin misiniz?')) {
      this.svc.delete(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(v => v.id !== id);
          this.setPage(this.currentPage);
        },
        error: () => this.error = 'Silme başarısız oldu.'
      });
    }
  }

  onRowClick(v: VardiyaDTO): void {
    const ref = this.dialog.open(VardiyaDetayDialogComponent, {
      data: v,
      width: '500px'
    });
    ref.afterClosed().subscribe(res => {
      if (res === 'duzenle') this.onEdit(v.id);
      else if (res === 'sil') this.onDelete(v.id);
    });
  }
}