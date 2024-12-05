import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticketpool } from '../util/ticketpool';

@Injectable({
  providedIn: 'root'
})
export class TicketpoolService {
  apiUrl = 'http://localhost:8080/api/v1/ticketpools';

  constructor(private http: HttpClient) { }

  fetchTicketPoolByEventId(eventId: string) {
    return this.http.get<Ticketpool>(`${this.apiUrl}/${eventId}`);
  }
}
