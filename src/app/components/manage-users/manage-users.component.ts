import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from "../home-template/home-template.component";
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Vendor } from '../../util/vendor';
import { VendorService } from '../../services/vendor.service';
import { Customer } from '../../util/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [HomeTemplateComponent, CommonModule, ButtonModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {

  allVendors: Signal<Vendor[] | []>;
  allCustomers: Signal<Customer[] | []>;

  constructor(private vendorService: VendorService, private customerService: CustomerService) { 
    this.allVendors = this.vendorService.allVendors;
    this.allCustomers = this.customerService.allCustomers
  }

  ngOnInit(): void {
    this.vendorService.fetchAllVendors();
    this.customerService.fetchAllCustomers();
  }

  // Map allVendors and allCustomers to a single array and add the type of user as an attribute
  getAllUsers(): any[] {
    let users: any[] = [];
    this.allVendors().forEach(vendor => {
      users.push({
        ...vendor,
        type: 'vendor'
      });
    });
    this.allCustomers().forEach(customer => {
      users.push({
        ...customer,
        type: 'customer'
      });
    });
    return users;
  }

}
