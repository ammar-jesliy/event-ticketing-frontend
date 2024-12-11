import { Component, OnInit } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { Customer } from '../../util/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HomeTemplateComponent, TooltipModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  customerDetails: Customer | null = null;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerService
      .fetchCustomerById(this.userDetails.id)
      .subscribe((customer) => {
        console.log(customer);
        this.customerDetails = customer;
      });
  }

  // Take the vip points as input and return the percentage of how much points are past the previous level. There are 3 levels, 0-100, 101-200, 201-300 and then 300+ is the max level. If the points are 150, then the percentage is 50% because it is 50% past the 100 level. If the points are over 300, then the percentage is 100%.
  getVipPointsPercentage(vipPoints: number): number {
    if (vipPoints <= 100) {
      return vipPoints;
    } else if (vipPoints <= 200) {
      return (vipPoints - 100);
    } else if (vipPoints <= 300) {
      return (vipPoints - 200);
    } else {
      return 100;
    }
  }
}
