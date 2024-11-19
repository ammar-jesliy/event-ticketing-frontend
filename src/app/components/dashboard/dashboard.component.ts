import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../header/header.component';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, HeaderComponent, SidemenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) {}

  logout() {
    console.log("Logged Out")

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    this.router.navigate(['/login']);
  }
}
