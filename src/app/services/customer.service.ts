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

  // To use the vendorDetails in other components, we need to create a getter method
  get customerDetails() {
    return this._customerDetails.asReadonly();
  }

  get allCustomers() {
    return this._allCustomers.asReadonly();
  }

  constructor(private http: HttpClient) {}

  fetchAllCustomers() {
    this.http.get<Customer[]>(`${this.apiUrl}`).subscribe((customers) => {
      this._allCustomers.set(customers);
    });
  }

  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  fetchCustomerById(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`);
  }

  registerCustomer(customer: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, customer);
  }

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

  buyTickets(eventId: string, customerId: string, numberOfTickets: number) {
    this.http.post(`${this.apiUrl}/buy-tickets`, {
      eventId,
      customerId,
      numberOfTickets,
    });
  }

  loadCustomerFromStorage() {
    const customerDetails = localStorage.getItem('user');
    if (customerDetails) {
      this._customerDetails.set(JSON.parse(customerDetails));
    }
  }
}
