/**
 * Service for managing customer-related operations.
 *
 * This service provides methods to interact with the backend API for customer-related operations,
 * such as fetching customer details, checking email availability, registering new customers,
 * logging in customers, updating customer profiles, purchasing tickets, and loading customer details
 * from local storage.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../util/user';
import { Customer } from '../util/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/v1/customers';

  private _customerDetails = signal<Customer | null>(null);
  private _allCustomers = signal<Customer[]>([]);

  get customerDetails() {
    return this._customerDetails.asReadonly();
  }

  get allCustomers() {
    return this._allCustomers.asReadonly();
  }

  constructor(private http: HttpClient) {}

  /**
   * Fetches all customers from the API and updates the `_allCustomers` property with the retrieved data.
   *
   */
  fetchAllCustomers() {
    this.http.get<Customer[]>(`${this.apiUrl}`).subscribe((customers) => {
      this._allCustomers.set(customers);
    });
  }

  /**
   * Checks the availability of an email address.
   *
   * This method sends a GET request to the server to determine if the provided
   * email address is already in use or available for registration.
   *
   * @param email - The email address to check for availability.
   * @returns An Observable that emits a boolean value indicating whether the email is available (true) or not (false).
   */
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  /**
   * Fetches a customer by their ID.
   *
   * @param customerId - The unique identifier of the customer to fetch.
   * @returns An Observable that emits the fetched Customer object.
   */
  fetchCustomerById(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`);
  }

  /**
   * Registers a new customer by sending a POST request to the server.
   *
   * @param customer - The customer information to be registered.
   * @returns An Observable that emits the server's response.
   */
  registerCustomer(customer: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, customer);
  }

  /**
   * Logs in a customer using their email and password.
   *
   * @param email - The email address of the customer.
   * @param password - The password of the customer.
   * @returns An Observable that emits the logged-in Customer object.
   */
  loginCustomer(email: string, password: string): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  updateCustomerProfile(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/update-profile`, customer);
  }

  saveUpdatedCustomer(customer: Customer) {
    this._customerDetails.set(customer);
    localStorage.setItem('user', JSON.stringify(customer));
  }

  /**
   * Purchases tickets for a specified event.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @param {string} customerId - The unique identifier of the customer.
   * @param {number} numberOfTickets - The number of tickets to purchase.
   * @returns {void}
   */
  buyTickets(eventId: string, customerId: string, numberOfTickets: number) {
    this.http.post(`${this.apiUrl}/buy-tickets`, {
      eventId,
      customerId,
      numberOfTickets,
    });
  }

  /**
   * Loads customer details from the local storage and sets them in the customer details state.
   *
   * This method retrieves the customer details stored under the key 'user' in the local storage.
   * If the details are found, they are parsed from JSON and set in the `_customerDetails` state.
   */
  loadCustomerFromStorage() {
    const customerDetails = localStorage.getItem('user');
    if (customerDetails) {
      this._customerDetails.set(JSON.parse(customerDetails));
    }
  }
}
