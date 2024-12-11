/**
 * Service for managing events.
 *
 * This service provides methods to interact with the event API, including fetching all events
 * and creating new events. It maintains an internal state of events and their names.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Event } from '../util/event';
import { Observable } from 'rxjs';

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

  /**
   * Fetches all events from the API and updates the internal state with the retrieved events.
   *
   * This method sends an HTTP GET request to the API endpoint specified by `this.apiUrl`.
   * Upon receiving the response, it updates the `_allEvents` and `_eventNames` properties
   * with the list of events and their names, respectively.
   *
   * @returns {void}
   */
  fetchAllEvents(): void {
    this.http.get<Event[]>(this.apiUrl).subscribe((events) => {
      this._allEvents.set(events);
      this._eventNames.set(events.map((event) => event.name));
    });
  }

  /**
   * Creates a new event by sending a POST request to the server.
   * After the event is successfully created, it fetches all events.
   *
   * @param event - The event object to be created.
   */
  createEvent(event: Event): Observable<any> {
    return this.http.post<Event>(this.apiUrl, event)
  }
}
