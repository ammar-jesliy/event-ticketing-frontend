import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Event } from '../util/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/v1/events';

  private _allEvents = signal<Event[]>([]);

  constructor(private http: HttpClient) {}

  get allEvents() {
    return this._allEvents.asReadonly();
  }

  fetchAllEvents() {
    this.http.get<Event[]>(this.apiUrl).subscribe((events) => {
      console.log("Fetched all events: ", events);
      this._allEvents.set(events);
    });
  }

}
