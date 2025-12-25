// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error = '';
  loading = false;
  shake = false;

  maxAttempts = 3;      
  attemptsLeft = 3;     

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sicil: ['', Validators.required],
      sifre: ['', Validators.required]
    });

    this.settings.getSettings().subscribe({
      next: res => {
        const m = Number(res.maxFailedAttempts);
        this.maxAttempts = isNaN(m) ? 3 : m;
        this.attemptsLeft = this.maxAttempts;
        console.log('🔧 maxAttempts from server:', this.maxAttempts);
      },
      error: () => {
        console.warn('⚠ Ayarlar yüklenemedi, varsayılan 3 kullanıldı.');
        this.attemptsLeft = this.maxAttempts;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.attemptsLeft <= 0) return;
    this.loading = true;

    const { sicil, sifre } = this.form.value;
    this.auth.login({ sicil, sifre }).subscribe({
      next: (res: AuthResponse) => {
        this.loading = false;
        this.attemptsLeft = this.maxAttempts;
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        this.showSuccessMessage();
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        // err.error.message eğer GlobalExceptionHandler ile JSON dönülüyorsa
        const body = err.error;
        const msg = body?.message ?? (typeof err.error === 'string' ? err.error : 'Bilinmeyen bir hata oluştu.');
        this.handleError(msg);
      }
    });
  }

  private handleError(msg: string): void {
    const text = msg.toLowerCase();
    if (text.includes('bloke')) {
      this.error = 'Hesabınız bloke edilmiş. Lütfen sistem yöneticisine başvurun.';
      this.attemptsLeft = 0;
      this.form.disable();
      return;
    }

    // hata mesajı sadece “geçersiz şifre” ise sayacı düşür
    this.attemptsLeft--;
    this.error = this.attemptsLeft > 0
      ? `Hatalı giriş. Kalan deneme hakkınız: ${this.attemptsLeft}.`
      : `${this.maxAttempts} kez hatalı giriş yaptınız, hesabınız bloke edildi.`;

    this.shake = true;
    setTimeout(() => this.shake = false, 400);
  }

  onReset(): void {
    this.form.enable();
    this.form.reset();
    this.error = '';
    this.attemptsLeft = this.maxAttempts;
    this.loading = false;
  }

  private showSuccessMessage(): void {
    this.snackBar.open('Başarıyla giriş yapıldı 🎉', '', {
      duration: 2500,
      panelClass: ['success-snackbar']
    });
  }
}
