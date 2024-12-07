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

  ngOnInit(): void {
    this.vendorService.fetchAllVendors();
    this.customerService.fetchAllCustomers();
  }

  // onClickDeleteUser(userType: string, userId: string) {
  //   this.displayDeleteUserDialog = true;
  //   console.log(`Delete user ${userType} with id ${userId}`);
  //   this.selectedUserId = userId;
  //   this.selectedUserType = userType;
  // }

  // deleteUser() {
  //   // Delete the user
  //   if (this.selectedUserType === 'vendor') {
  //     this.vendorService.deleteVendor(this.selectedUserId).subscribe(() => {
  //       console.log('Vendor deleted');
  //       this.displayDeleteUserDialog = false;
  //       this.vendorService.fetchAllVendors();
  //     });
  //   } else if (this.selectedUserType === 'customer') {
  //     console.log('Deleting customer');
  //     this.displayDeleteUserDialog = false;
  //   }
  // }

  // Map allVendors and allCustomers to a single array and add the type of user as an attribute, and sort by date created
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
