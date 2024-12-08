/**
 * Service for managing vendor-related operations.
 *
 * This service provides methods to interact with the backend API for various vendor-related
 * operations such as fetching vendors, checking email availability, registering vendors,
 * logging in, updating profiles, and releasing tickets.
 *
 */
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

  get vendorDetails() {
    return this._vendorDetails.asReadonly();
  }

  get allVendors() {
    return this._allVendors.asReadonly();
  }

  constructor(private http: HttpClient) {}

  /**
   * Fetches all vendors from the API and updates the `_allVendors` property with the retrieved data.
   *
   */
  fetchAllVendors() {
    this.http.get<Vendor[]>(`${this.apiUrl}`).subscribe((vendors) => {
      this._allVendors.set(vendors);
    });
  }

  /**
   * Checks the availability of an email address.
   *
   * Sends a GET request to the server to determine if the provided email address
   * is available for use.
   *
   * @param email - The email address to check for availability.
   * @returns An Observable that emits a boolean value indicating whether the email is available.
   */
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  /**
   * Fetches a vendor by its ID.
   *
   * @param vendorId - The unique identifier of the vendor to fetch.
   * @returns An Observable that emits the fetched Vendor object.
   */
  fetchVendorById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${vendorId}`);
  }

  /**
   * Registers a new vendor by sending a POST request to the server.
   *
   * @param {User} vendor - The vendor object containing the details of the vendor to be registered.
   * @returns {Observable<any>} - An observable that emits the server's response.
   */
  registerVendor(vendor: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, vendor);
  }

  /**
   * Logs in a vendor using the provided email and password.
   *
   * @param email - The email address of the vendor.
   * @param password - The password of the vendor.
   * @returns An Observable that emits the logged-in Vendor object.
   */
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

  /**
   * Loads vendor details from the local storage and sets them to the `_vendorDetails` property.
   * The vendor details are expected to be stored in the local storage under the key 'user'.
   * If the details are found, they are parsed from JSON and set to the `_vendorDetails` property.
   */
  loadVendorFromStorage() {
    const vendorDetails = localStorage.getItem('user');
    if (vendorDetails) {
      this._vendorDetails.set(JSON.parse(vendorDetails));
    }
  }

  /**
   * Releases tickets for a specified event by a vendor.
   *
   * @param eventId - The unique identifier of the event.
   * @param vendorId - The unique identifier of the vendor.
   * @param ticketPrice - The price of each ticket.
   * @param ticketQuantity - The number of tickets to be released.
   * @returns An observable of the HTTP POST request.
   */
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
}
