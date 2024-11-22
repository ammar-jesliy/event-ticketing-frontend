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

  // To use the vendorDetails in other components, we need to create a getter method
  get vendorDetails() {
    return this._vendorDetails.asReadonly();
  }

  constructor(private http: HttpClient) {}

  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
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
    const vendorDetials = localStorage.getItem('user');
    if (vendorDetials) {
      this._vendorDetails.set(JSON.parse(vendorDetials));
    }
  }

}
