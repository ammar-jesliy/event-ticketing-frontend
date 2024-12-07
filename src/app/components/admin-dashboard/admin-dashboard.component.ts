import { Component } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {}
