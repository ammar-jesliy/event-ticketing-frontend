/**
 * SidemenuComponent is a standalone Angular component that represents a side menu in the application.
 * 
 * It provides navigation links based on the user role and allows the user to log out.
 * 
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

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

  /**
   * Checks if the given route matches the current router URL.
   *
   * @param route - The route to check against the current URL.
   * @returns A boolean indicating whether the given route is active.
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  /**
   * Logs the user out by removing authentication and user information from local storage,
   * and then navigates to the login page.
   *
   */
  logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
