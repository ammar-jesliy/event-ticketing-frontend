import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
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

  fetchAllTicketPools() {
    return this.http
      .get<Ticketpool[]>(`${this.apiUrl}`)
      .subscribe((ticketPools) => {
        this._allTicketPools.set(ticketPools);
      });
  }

  fetchTicketPoolByEventId(eventId: string) {
    return this.http.get<Ticketpool>(`${this.apiUrl}/${eventId}`);
  }
}
