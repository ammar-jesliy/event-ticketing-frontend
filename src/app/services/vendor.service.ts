import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../util/user';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private apiUrl = 'http://localhost:8080/api/v1/vendors';

  constructor(private http: HttpClient) {}

  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  registerVendor(vendor: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, vendor);
  }

  loginVendor(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
}
