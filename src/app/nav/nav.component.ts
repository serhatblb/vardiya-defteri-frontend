// nav.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RoleService, UserRole } from '../services/role.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    NgIf
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  role: UserRole | null = null;

  constructor(
    public roleSvc: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // İlk rol bilgisini al
    this.updateRole();
    // Her rota değişiminde rolü yeniden oku
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateRole());
  }

  private updateRole(): void {
    this.role = this.roleSvc.getUserRole();
    console.log('🧠 Navbar güncellenen rol:', this.role);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
