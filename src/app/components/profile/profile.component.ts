/**
 * ProfileComponent is responsible for displaying and managing the user's profile information.
 * It retrieves user details from local storage and fetches customer details from the server.
 * The component also provides a method to calculate the VIP points percentage.
 *
 */

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

  constructor(private customerService: CustomerService) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * This method is used to retrieve user details from local storage and fetch customer details from the server.
   *
   * - Retrieves user details from local storage and parses them into an object.
   * - Calls the customer service to fetch customer details by user ID.
   * - Subscribes to the customer service observable to receive customer data and assigns it to `customerDetails`.
   */
  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerService
      .fetchCustomerById(this.userDetails.id)
      .subscribe((customer) => {
        console.log(customer);
        this.customerDetails = customer;
      });
  }

  /**
   * Calculates the VIP points percentage based on the given VIP points.
   *
   * @param vipPoints - The number of VIP points.
   * @returns The VIP points percentage. The percentage is calculated as follows:
   * - If vipPoints is 100 or less, the percentage is equal to vipPoints.
   * - If vipPoints is between 101 and 200, the percentage is vipPoints minus 100.
   * - If vipPoints is between 201 and 300, the percentage is vipPoints minus 200.
   * - If vipPoints is greater than 300, the percentage is capped at 100.
   */
  getVipPointsPercentage(vipPoints: number): number {
    if (vipPoints <= 100) {
      return vipPoints;
    } else if (vipPoints <= 200) {
      return vipPoints - 100;
    } else if (vipPoints <= 300) {
      return vipPoints - 200;
    } else {
      return 100;
    }
  }
}
