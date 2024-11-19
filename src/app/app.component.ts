import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'event-ticketing-frontend';
  value!: number;

  isLoggedIn(): boolean {
    // Check if the user is authenticated by checking the value in local storage
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log(isAuthenticated);
    return isAuthenticated !== null && isAuthenticated === 'true';
  }
}
