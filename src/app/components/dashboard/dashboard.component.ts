import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { TooltipModule } from 'primeng/tooltip';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../util/vendor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    HomeTemplateComponent,
    TooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  vendorDetails: Signal<Vendor | null>;

  constructor(private router: Router, private vendorService: VendorService) {
    this.vendorDetails = this.vendorService.vendorDetails;
  }

  ngOnInit() {
    this.vendorService.loadVendorFromStorage();
  }

  logout() {
    console.log('Logged Out');

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
