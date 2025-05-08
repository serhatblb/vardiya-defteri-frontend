import {
  Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatTableModule, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver-es';
import html2pdf from 'html2pdf.js';

import { UserService, UserDTO } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'sicil', 'adSoyad', 'unvan', 'unite', 'rol',
    'hesapAcilisTarihi', 'hesapSilmeTarihi', 'silinmeNedeni',
    'sonBlokeTarihi', 'blokeMi', 'actions'
  ];

  dataSource = new MatTableDataSource<UserDTO>([]);
  error = '';

  filterText = '';
  selectedRole = '';
  showOnlyActive = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<UserDTO>;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(): void {
    const filter = {
      ad: this.filterText || null,
      sicil: null,
      unvan: null,
      unite: null,
      rol: this.selectedRole || null,
      blokeMi: this.showOnlyActive ? false : null
    };
  
    console.log("🟨 Giden filtre:", filter); // LOG 1
  
    this.userService.getFilteredUsers(filter).subscribe({
      next: users => {
        console.log("🟩 Gelen kullanıcılar:", users); // LOG 2
        this.dataSource.data = users;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error("❌ API hatası:", err); // LOG 3
        this.error = 'Kullanıcılar filtrelenemedi.';
      }
    });
  }
  

  onSearchChange(value: string): void {
    this.filterText = value;
    this.applyFilters();
  }

  clearDates(): void {
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  deleteUser(user: UserDTO): void {
    const reason = prompt('Silme nedeni giriniz:');
    if (!reason?.trim()) return;

    this.userService.softDelete(user.id, reason).subscribe({
      next: () => {
        this.applyFilters();
        Promise.resolve().then(() => this.table?.renderRows());
      },
      error: () => this.error = 'Silme yapılamadı.'
    });
  }

  unblockUser(user: UserDTO): void {
    this.userService.unblockUser(user.id).subscribe({
      next: () => {
        const updated = this.dataSource.data.map(u =>
          u.id === user.id ? { ...u, blokeMi: false, sonBlokeTarihi: null } : u
        );
        this.dataSource.data = [...updated];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Blokeyi kaldıramadı.'
    });
  }

  excelAktar(): void {
    const now = new Date().toLocaleString('tr-TR');
    const filtreSatiri = [{
      Rapor: 'Kullanıcı Raporu',
      Tarih: now,
      Filtre: `Ad/Sicil: ${this.filterText || 'Yok'}, Rol: ${this.selectedRole || 'Tümü'}, Aktif: ${this.showOnlyActive ? 'Evet' : 'Hayır'}`
    }];
  
    const exportData = this.dataSource.data.map(u => ({
      Sicil: u.sicil,
      Ad: u.ad,
      Soyad: u.soyad,
      Ünvan: u.unvan || '',
      Ünite: u.unite,
      Rol: this.getShortRole(u.rol),
      'Açılış Tarihi': u.hesapAcilisTarihi ? new Date(u.hesapAcilisTarihi).toLocaleDateString('tr-TR') : '',
      'Silinme Tarihi': u.hesapSilmeTarihi ? new Date(u.hesapSilmeTarihi).toLocaleDateString('tr-TR') : '',
      'Silinme Nedeni': u.silinmeNedeni || '',
      'Son Bloke': u.sonBlokeTarihi ? new Date(u.sonBlokeTarihi).toLocaleDateString('tr-TR') : '',
      Bloke: u.blokeMi ? 'Evet' : 'Hayır'
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_json(ws, filtreSatiri, { origin: 'A1' });
    XLSX.utils.sheet_add_json(ws, exportData, { origin: -1 });
  
    const wb: XLSX.WorkBook = { Sheets: { 'Kullanıcı Raporu': ws }, SheetNames: ['Kullanıcı Raporu'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'kullanici_raporu.xlsx');
  }
  

  pdfAktar(): void {
    const now = new Date().toLocaleString('tr-TR');
    const toplam = this.dataSource.data.length;
    const filtreBilgisi = `
      <p><strong>Rapor Tarihi:</strong> ${now}</p>
      <p><strong>Filtre:</strong> ${this.filterText || 'Yok'} | 
         <strong>Rol:</strong> ${this.selectedRole || 'Tümü'} | 
         <strong>Sadece Aktif:</strong> ${this.showOnlyActive ? 'Evet' : 'Hayır'}</p>
      <p><strong>Kayıt Sayısı:</strong> ${toplam}</p>
      <br/>
    `;
  
    const tabloHtml = document.getElementById('exportableTable')?.outerHTML || '<p>Tablo bulunamadı.</p>';
  
    const fullHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Kullanıcı Raporu</h2>
        ${filtreBilgisi}
        ${tabloHtml}
      </div>
    `;
  
    const opt = {
      margin: 0.5,
      filename: 'kullanici_raporu.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
  
    html2pdf().from(fullHtml).set(opt).save();
  }
  

  getShortRole(role: string): string {
    switch (role) {
      case 'SISTEM_YONETICISI': return 'S. Yön.';
      case 'ISLETME_SORUMLUSU': return 'İşletme S.';
      case 'NORMAL_KULLANICI': return 'Normal';
      default: return role;
    }
  }

  trackByUserId(_: number, user: UserDTO): string {
    return user.id.toString();
  }
}