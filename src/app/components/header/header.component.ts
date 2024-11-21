import { Component } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  title: String = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.title =
          this.router.url.split('/')[1].charAt(0).toUpperCase() +
          this.router.url.split('/')[1].slice(1);
      }
    });
  }
}
