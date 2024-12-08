import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../util/user';
import { Vendor } from '../util/vendor';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private apiUrl = 'http://localhost:8080/api/v1/vendors';

  private _vendorDetails = signal<Vendor | null>(null);
  private _allVendors = signal<Vendor[]>([]);

  // To use the vendorDetails in other components, we need to create a getter method
  get vendorDetails() {
    return this._vendorDetails.asReadonly();
  }

  get allVendors() {
    return this._allVendors.asReadonly();
  }

  constructor(private http: HttpClient) {}

  fetchAllVendors() {
    this.http.get<Vendor[]>(`${this.apiUrl}`).subscribe((vendors) => {
      this._allVendors.set(vendors);
    });
  }

  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  fetchVendorById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${vendorId}`);
  }

  registerVendor(vendor: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, vendor);
  }

  loginVendor(email: string, password: string): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/login`, { email, password });
  }

  updateVendorProfile(vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/update-profile`, vendor);
  }

  saveUpdatedVendor(vendor: Vendor) {
    this._vendorDetails.set(vendor);
    localStorage.setItem('user', JSON.stringify(vendor));
  }

  loadVendorFromStorage() {
    const vendorDetails = localStorage.getItem('user');
    if (vendorDetails) {
      this._vendorDetails.set(JSON.parse(vendorDetails));
    }
  }

  releaseTicket(
    eventId: string,
    vendorId: string,
    ticketPrice: number,
    ticketQuantity: number
  ) {
    this.http.post(`${this.apiUrl}/release-tickets`, {
      eventId: eventId,
      vendorId: vendorId,
      numberOfTickets: ticketQuantity,
      price: ticketPrice,
    });
  }

  deleteVendor(vendorId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${vendorId}`);
  }
}
