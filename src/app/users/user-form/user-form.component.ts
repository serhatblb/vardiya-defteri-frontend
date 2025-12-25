// src/app/users/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {
  UserService,
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  UserRole
} from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  roles: UserRole[] = ['SISTEM_YONETICISI', 'ISLETME_SORUMLUSU', 'NORMAL_KULLANICI'];
  uniteList = [
    'KOKHANE',
    'YUKSEK_FIRIN',
    'KONVERTOR',
    'HADDEHANE',
    'ENERJI',
    'LABORATUVAR',
    'BAKIM',
    'MÜHENDİSLİK',
    'KALİTE',
    'İNSAN_KAYNAKLARI',
  ];
  error = '';
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private svc: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      sicil: ['', Validators.required],
      sifre: ['', this.editMode ? [] : Validators.required],
      ad: ['', Validators.required],
      soyad: ['', Validators.required],
      unvan: ['', Validators.required],
      unite: ['', Validators.required],
      rol: ['', Validators.required]
    });
    // Eğer editMode ve route ile yüklenecekse, burada dto’yu yükleyip patchValue yapabilirsiniz.
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error = 'Lütfen tüm zorunlu alanları doldurunuz.';
      return;
    }

    if (this.editMode) {
      const dto: UpdateUserDTO = {
        ...this.form.value,
        id: this.form.value.id,
        // sifre optional, eğer boşsa backend’de değiştirmezsiniz
      };
      this.svc.update(dto).subscribe({
        next: () => this.router.navigate(['/users']),
        error: () => this.error = 'Güncelleme başarısız.'
      });
    } else {
      const dto: CreateUserDTO = this.form.value;
      this.svc.create(dto).subscribe({
        next: () => this.router.navigate(['/users']),
        error: () => this.error = 'Oluşturma başarısız.'
      });
    }
  }

  onDelete(): void {
    const userId = this.form.get('id')!.value as number;
    const reason = prompt('Silme nedeni giriniz:');
    if (!reason) {
      alert('Silme nedeni boş olamaz.');
      return;
    }
    this.svc.softDelete(userId, reason).subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => this.error = 'Silme başarısız.'
    });
  }

  onUnblock(): void {
    const userId = this.form.get('id')!.value as number;
    this.svc.unblockUser(userId).subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => this.error = 'Bloke kaldırılamadı.'
    });
  }
}
