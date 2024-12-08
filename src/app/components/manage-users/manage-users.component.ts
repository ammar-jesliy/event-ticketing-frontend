/**
 * Component responsible for managing users, including vendors and customers.
 * It fetches and displays all users
 *
 * This component is only accessible to the system admin.
 *
 */

import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Vendor } from '../../util/vendor';
import { VendorService } from '../../services/vendor.service';
import { Customer } from '../../util/customer';
import { CustomerService } from '../../services/customer.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [HomeTemplateComponent, CommonModule, ButtonModule, DialogModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent implements OnInit {
  allVendors: Signal<Vendor[] | []>;
  allCustomers: Signal<Customer[] | []>;

  displayDeleteUserDialog: boolean = false;
  selectedUserId: string = '';
  selectedUserType: string = '';

  constructor(
    private vendorService: VendorService,
    private customerService: CustomerService
  ) {
    this.allVendors = this.vendorService.allVendors;
    this.allCustomers = this.customerService.allCustomers;
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * This method is used to fetch all vendors and customers when the component is initialized.
   *
   */
  ngOnInit(): void {
    this.vendorService.fetchAllVendors();
    this.customerService.fetchAllCustomers();
  }

  /**
   * Retrieves all users, including vendors and customers, and sorts them by their creation date.
   *
   * @returns {any[]} An array of user objects, each with an additional `type` property indicating whether the user is a 'vendor' or 'customer'.
   */
  getAllUsers(): any[] {
    let users: any[] = [];
    this.allVendors().forEach((vendor) => {
      users.push({
        ...vendor,
        type: 'vendor',
      });
    });
    this.allCustomers().forEach((customer) => {
      users.push({
        ...customer,
        type: 'customer',
      });
    });
    return users.sort((a, b) => {
      if (!a.dateCreated) return 1;
      if (!b.dateCreated) return -1;
      return (
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      );
    });
  }
}
