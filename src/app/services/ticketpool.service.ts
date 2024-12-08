/**
 * Service for managing ticket pools.
 *
 * This service provides methods to interact with the ticket pool API, including fetching all ticket pools
 * and fetching a specific ticket pool by event ID.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Ticketpool } from '../util/ticketpool';

@Injectable({
  providedIn: 'root',
})
export class TicketpoolService {
  apiUrl = 'http://localhost:8080/api/v1/ticketpools';

  private _allTicketPools = signal<Ticketpool[] | null>(null);

  get allTicketPools() {
    return this._allTicketPools.asReadonly();
  }

  constructor(private http: HttpClient) {}

  /**
   * Fetches all ticket pools from the API.
   *
   * This method sends an HTTP GET request to the API endpoint specified by `this.apiUrl`
   * and retrieves an array of `Ticketpool` objects. The retrieved ticket pools are then
   * stored in the `_allTicketPools` property.
   *
   * @returns {Subscription} A subscription to the HTTP GET request.
   */
  fetchAllTicketPools() {
    return this.http
      .get<Ticketpool[]>(`${this.apiUrl}`)
      .subscribe((ticketPools) => {
        this._allTicketPools.set(ticketPools);
      });
  }

  /**
   * Fetches the ticket pool for a given event by its ID.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {Observable<Ticketpool>} An observable containing the ticket pool data for the specified event.
   */
  fetchTicketPoolByEventId(eventId: string) {
    return this.http.get<Ticketpool>(`${this.apiUrl}/${eventId}`);
  }
}
