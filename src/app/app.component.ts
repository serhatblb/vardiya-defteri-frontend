// src/app/app.component.ts
import { Component }           from '@angular/core';
import { RouterOutlet }        from '@angular/router';
import { NavComponent }        from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent
  ],
  template: `
    <app-nav></app-nav>
    <main class="p-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
