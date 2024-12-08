/**
 * This file, TransactionsComponent is responsible for displaying and managing transactions
 * based on the user's role (vendor, customer, or admin). It fetches and caches event, customer,
 * and vendor data to optimize performance and user experience.
 * 
 * This component is accessible to all users (vendors, customers, and admins).
 */
import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Transaction } from '../../util/transaction';
import { Event } from '../../util/event';
import { TransactionService } from '../../services/transaction.service';
import { EventService } from '../../services/event.service';
import { CustomerService } from '../../services/customer.service';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [HomeTemplateComponent, CommonModule, TooltipModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  userRole: string = localStorage.getItem('userRole') || '';

  allEvents: Signal<Event[] | null>;
  allTransactions: Signal<Transaction[] | []>;
  vendorTransactions: Signal<Transaction[] | []>;
  customerTransactions: Signal<Transaction[] | []>;
  customerNameCache: Map<string, string> = new Map();
  vendorNameCache: Map<string, string> = new Map();

  constructor(
    private vendorService: VendorService,
    private transactionService: TransactionService,
    private eventService: EventService,
    private customerService: CustomerService
  ) {
    this.allEvents = this.eventService.allEvents;
    this.allTransactions = this.transactionService.allTransactions;
    this.vendorTransactions = this.transactionService.vendorTransactions;
    this.customerTransactions = this.transactionService.customerTransactions;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Initializes the component by fetching all events and transactions based on the user's role.
   *
   * - If the user is a vendor, fetches transactions by vendor ID.
   * - If the user is a customer, fetches transactions by customer ID.
   * - If the user is an admin, fetches all transactions.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    // Fetch all events
    this.eventService.fetchAllEvents();

    // Fetch transactions based on user role
    if (this.userRole === 'vendor') {
      this.transactionService.fetchTransactionsByVendorId(
        JSON.parse(localStorage.getItem('user') || '{}').id
      );
    } else if (this.userRole === 'customer') {
      this.transactionService.fetchTransactionsByCustomerId(
        JSON.parse(localStorage.getItem('user') || '{}').id
      );
    } else if (this.userRole === 'admin') {
      this.transactionService.fetchAllTransactions();
    }
  }

  /**
   * Retrieves the name of an event based on the provided event ID.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {string} The name of the event if found, otherwise an empty string.
   */
  getEventName(eventId: string) {
    return this.allEvents()?.find((event) => event.id === eventId)?.name || '';
  }

  /**
   * Sorts an array of transactions by their timestamp in descending order.
   *
   * @param transactions - The array of transactions to be sorted.
   * @returns The sorted array of transactions.
   */
  sortByDate(transactions: Transaction[]) {
    return transactions.sort((a, b) => {
      return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
    });
  }

  /**
   * Retrieves the name of a customer based on their ID.
   *
   * This method first checks if the customer's name is already cached. If it is,
   * the cached name is returned. If not, it fetches the customer's details from
   * the customer service and caches the name. While the name is being fetched,
   * it returns a placeholder text 'Loading...'.
   *
   * @param customerId - The unique identifier of the customer.
   * @returns The name of the customer if cached, otherwise 'Loading...' while fetching.
   */
  getCustomerName(customerId: string) {
    if (this.customerNameCache.has(customerId)) {
      return this.customerNameCache.get(customerId)!;
    }

    this.customerService.fetchCustomerById(customerId).subscribe((customer) => {
      this.customerNameCache.set(customerId, customer.name);
    });

    return 'Loading...'; // Placeholder text while fetching
  }

  /**
   * Retrieves the vendor name for a given vendor ID.
   *
   * This method first checks if the vendor name is already cached. If it is, the cached name is returned.
   * If the vendor name is not cached, it fetches the vendor details from the vendor service and caches the name.
   * While the vendor name is being fetched, it returns a placeholder text 'Loading...'.
   *
   * @param vendorId - The unique identifier of the vendor.
   * @returns The vendor name if cached, otherwise 'Loading...' while the name is being fetched.
   */
  getVendorName(vendorId: string) {
    if (this.vendorNameCache.has(vendorId)) {
      return this.vendorNameCache.get(vendorId)!;
    }

    this.vendorService.fetchVendorById(vendorId).subscribe((vendor) => {
      this.vendorNameCache.set(vendorId, vendor.name);
    });

    return 'Loading...'; // Placeholder text while fetching
  }
}
