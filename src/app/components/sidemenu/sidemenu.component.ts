import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [ButtonModule, SidebarModule, RouterModule, CommonModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css',
})
export class SidemenuComponent {

  role: string = localStorage.getItem('userRole') || '';

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    console.log('Logged Out');

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
