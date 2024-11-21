import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, HomeTemplateComponent],
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
