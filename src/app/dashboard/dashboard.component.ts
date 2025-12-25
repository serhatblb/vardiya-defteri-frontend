import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';

import { DashboardDTO } from '../models/dashboard.model';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VardiyaService } from '../services/vardiya.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data?: DashboardDTO;
  rol: string | null = null;
  todayCount = 0;
  
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private vs: VardiyaService,
    private roleSvc: RoleService
  ) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');

    this.dashboardService.getDashboardData().subscribe({
      next: res => {
        this.data = res;
      },
      error: err => {
        console.error('Dashboard verileri alınamadı:', err);
      }
    });
  }

  goToUserForm(): void {
    this.router.navigate(['/users/new']);
  }

  navigate(): void {
    this.router.navigate(['/vardiya-new']);
  }
}
