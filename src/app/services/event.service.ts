import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Event } from '../util/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/v1/events';

  private _allEvents = signal<Event[]>([]);
  private _eventNames = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  get allEvents() {
    return this._allEvents.asReadonly();
  }

  get eventNames() {
    return this._eventNames.asReadonly();
  }

  fetchAllEvents() {
    this.http.get<Event[]>(this.apiUrl).subscribe((events) => {
      console.log('Fetched all events: ', events);
      this._allEvents.set(events);
      this._eventNames.set(events.map((event) => event.name));
    });
  }

  createEvent(event: Event) {
    this.http.post<Event>(this.apiUrl, event).subscribe(() => {
      this.fetchAllEvents();
    });
  }
}
