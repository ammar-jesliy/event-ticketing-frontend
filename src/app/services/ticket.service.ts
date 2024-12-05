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

  fetchAllTickets() {
    this.http.get<Ticket[]>(`${this.apiUrl}`).subscribe((tickets) => {
      console.log('Fetched tickets: ', tickets);
      this._allTickets.set(tickets);
    });
  }

  fetchTicketsByVendorId(vendorId: string) {
    this.http
      .get<Ticket[]>(`${this.apiUrl}/vendor/${vendorId}`)
      .subscribe((tickets) => {
        console.log('Fetched vendor tickets: ', tickets);
        this._vendorTickets.set(tickets);
      });
  }
}
