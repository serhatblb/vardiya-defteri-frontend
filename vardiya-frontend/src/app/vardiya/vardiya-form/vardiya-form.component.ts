import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { VardiyaService, VardiyaDTO } from '../../services/vardiya.service';
import { UserService, UserDTO } from '../../services/user.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-vardiya-form',
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
  templateUrl: './vardiya-form.component.html',
  styleUrls: ['./vardiya-form.component.scss']
})
export class VardiyaFormComponent implements OnInit {
  form!: FormGroup;
  users: UserDTO[] = [];
  types: string[] = ['SAAT_08_16','SAAT_16_00','SAAT_00_08','SAAT_00_12','SAAT_12_00'];
  isAdmin = false;
  error = '';
  vardiyaId?: number;

  constructor(
    private fb: FormBuilder,
    private svc: VardiyaService,
    private userSvc: UserService,
    private roleSvc: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      vardiyaType: ['', Validators.required],
      tarih: ['', Validators.required],
      saat: ['', Validators.required],
      notIcerik: ['', Validators.required]
    });

    const role = this.roleSvc.getUserRole();
    const userId = this.roleSvc.getUserId();
    this.isAdmin = role === 'SISTEM_YONETICISI';

    if (this.isAdmin) {
      this.userSvc.getAll().subscribe({
        next: users => this.users = users,
        error: () => this.error = 'Kullanıcılar yüklenemedi.'
      });
    } else if (userId != null) {
      this.form.get('userId')?.setValue(userId);
      this.form.get('userId')?.disable();
    }

    this.vardiyaId = +this.route.snapshot.paramMap.get('id')!;

    if (this.vardiyaId) {
      this.svc.getById(this.vardiyaId).subscribe({
        next: vardiya => {
          const now = new Date();
          const timeStr = now.toTimeString().substring(0, 5);

          this.form.patchValue({
            userId: vardiya.userId,
            vardiyaType: vardiya.vardiyaType,
            tarih: vardiya.tarih,
            saat: timeStr, // 🕒 Güncel saat set edilir
            notIcerik: vardiya.notIcerik
          });

          if (!this.isAdmin) {
            this.form.get('userId')?.disable();
          }
        },
        error: err => {
          console.error('Vardiya notu alınamadı:', err);
          this.error = 'Vardiya notu yüklenemedi.';
        }
      });
    } else {
      const now = new Date();
      const todayStr = now.toISOString().substring(0, 10);
      const timeStr = now.toTimeString().substring(0, 5);
      this.form.patchValue({ tarih: todayStr, saat: timeStr });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error = 'Lütfen tüm alanları doldurunuz.';
      return;
    }

    const raw = this.form.getRawValue();
    const tarihFix = new Date(raw.tarih).toISOString().substring(0, 10);

    const dto: VardiyaDTO = {
      userId: raw.userId!,
      vardiyaType: raw.vardiyaType!,
      tarih: tarihFix,
      notIcerik: raw.notIcerik!
    };

    if (this.vardiyaId) {
      this.svc.update(this.vardiyaId, dto).subscribe({
        next: () => this.router.navigate(['/vardiya-list']),
        error: err => {
          console.error('⛔ Güncelleme hatası:', err);
          this.error = 'Vardiya güncellenemedi.';
        }
      });
    } else {
      this.svc.create(dto.userId, dto).subscribe({
        next: () => this.router.navigate(['/vardiya-list']),
        error: err => {
          console.error('⛔ Oluşturma hatası:', err);
          this.error = 'Vardiya notu oluşturulamadı.';
        }
      });
    }
  }
}
