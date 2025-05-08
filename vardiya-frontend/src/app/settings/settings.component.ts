import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  maxFailedAttempts: number = 3;
  minPasswordLength: number = 6;
  selectedUserId: number | null = null;
  defaultPassword: string = '';
  userList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadUsers();
  }

  loadSettings() {
    this.http.get<{ [key: string]: string }>('/api/settings')
      .subscribe(data => {
        this.maxFailedAttempts = Number(data['maxFailedAttempts']) || 3;
        this.minPasswordLength = Number(data['minPasswordLength']) || 6;
        this.defaultPassword = data['defaultPassword'] || '';
      });
  }

  saveSettings() {
    const payload = {
      maxFailedAttempts: this.maxFailedAttempts,
      minPasswordLength: this.minPasswordLength,
      defaultPassword: this.defaultPassword || ''
    };
  
    this.http.post('/api/settings', payload).subscribe({
      next: () => {
        console.log("✅ Ayarlar kaydedildi:", payload);
      },
      error: (err) => {
        console.error("⛔ Ayar kaydederken hata oluştu:", err);
      }
    });
  }

  loadUsers() {
    this.http.get<any[]>('/api/users').subscribe(data => {
      this.userList = data;
    });
  }

  generateAndFillRandomPassword() {
    const length = this.minPasswordLength || 8;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    this.defaultPassword = result;
  }

  resetPassword() {
    if (!this.selectedUserId || !this.defaultPassword) return;

    const payload = { newPassword: this.defaultPassword };
    this.http.post(`/api/users/${this.selectedUserId}/reset-password`, payload)
      .subscribe(() => alert('🔐 Şifre sıfırlandı.'));
  }
}
