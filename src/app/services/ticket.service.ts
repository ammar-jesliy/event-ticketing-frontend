/**
 * Service for managing tickets.
 *
 * This service provides methods to fetch all tickets and tickets by vendor ID from the API.
 * It uses Angular's HttpClient to make HTTP requests and stores the retrieved tickets in signals.
 */

import { Injectable, signal } from '@angular/core';
import { Ticket } from '../util/ticket';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:8080/api/v1/tickets';

  private _allTickets = signal<Ticket[]>([]);
  private _vendorTickets = signal<Ticket[]>([]);

  constructor(private http: HttpClient) {}

  get allTickets() {
    return this._allTickets.asReadonly();
  }

  get vendorTickets() {
    return this._vendorTickets.asReadonly();
  }

  /**
   * Fetches all tickets from the API and updates the `_allTickets` property with the retrieved tickets.
   *
   *
   * @returns void
   */
  fetchAllTickets() {
    this.http.get<Ticket[]>(`${this.apiUrl}`).subscribe((tickets) => {
      this._allTickets.set(tickets);
    });
  }

  /**
   * Fetches tickets by vendor ID.
   *
   * This method sends an HTTP GET request to retrieve tickets associated with a specific vendor.
   * The retrieved tickets are then stored in the `_vendorTickets` map.
   *
   * @param vendorId - The unique identifier of the vendor whose tickets are to be fetched.
   */
  fetchTicketsByVendorId(vendorId: string) {
    this.http
      .get<Ticket[]>(`${this.apiUrl}/vendor/${vendorId}`)
      .subscribe((tickets) => {
        this._vendorTickets.set(tickets);
      });
  }
}
