import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { Event } from '../../util/event';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../util/ticket';
import { TicketService } from '../../services/ticket.service';
import { TicketpoolService } from '../../services/ticketpool.service';
import { Ticketpool } from '../../util/ticketpool';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-buy-tickets',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.css',
})
export class BuyTicketsComponent implements OnInit {
  buyTicketForm!: FormGroup;

  allEvents: Signal<Event[] | null>;
  allTickets: Signal<Ticket[] | null>;
  ticketPoolCache: Map<string, Ticketpool> = new Map();

  selectedEvent: Event | undefined = undefined;

  displayDialog: boolean = false;

  constructor(
    private eventService: EventService,
    private ticketService: TicketService,
    private ticketpoolService: TicketpoolService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.allEvents = this.eventService.allEvents;
    this.allTickets = this.ticketService.allTickets;
  }

  ngOnInit(): void {
    // Fetch all events
    this.eventService.fetchAllEvents();
    this.ticketService.fetchAllTickets();

    this.buyTicketForm = this.fb.group({
      quantity: ['', Validators.required],
    });
  }

  onClick(eventId: string) {
    console.log('Clicked on event: ', eventId);
    this.selectedEvent = this.allEvents()?.find(
      (event) => event.id === eventId
    );
    this.displayDialog = true;
  }

  onSubmit() {
    if (this.buyTicketForm.valid && this.selectedEvent) {
      const { quantity } = this.buyTicketForm.value;
      const customerId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const eventId = this.selectedEvent.id || '';

      // Buy tickets
      this.customerService.buyTickets(eventId, customerId, quantity);

      this.displayDialog = false;
      this.buyTicketForm.reset();
    } else {
      this.buyTicketForm.markAllAsTouched();
    }
  }

  // Return a list of events that have tickets available by checking the tickets list has tickets in the ticket pool
  eventsWithTickets(): Event[] {
    const events = this.allEvents() || [];
    events.forEach((event) => {
      if (event.id && !this.ticketPoolCache.has(event.id)) {
        this.fetchTicketPoolByEventId(event.id);
      }
    });
    return events.filter((event) => {
      const ticketPool = event.id
        ? this.ticketPoolCache.get(event.id)
        : undefined;
      return ticketPool && ticketPool.tickets.length > 0;
    });
  }

  // Fetch ticketpool by eventId and store in map
  fetchTicketPoolByEventId(eventId: string) {
    if (!this.ticketPoolCache.has(eventId)) {
      this.ticketpoolService
        .fetchTicketPoolByEventId(eventId)
        .subscribe((ticketPool) => {
          this.ticketPoolCache.set(eventId, ticketPool);
        });
    }
  }

  // Get most expensive ticket price of a given event
  getMostExpensiveTicketPrice(eventId: string): number | undefined {
    const mostExpensiveTicket = this.allTickets()
      ?.filter((ticket) => ticket.eventId === eventId)
      .reduce((a, b) => (a.price > b.price ? a : b));
    return mostExpensiveTicket?.price;
  }

  // Get least expensive ticket price of a given event
  getLeastExpensiveTicketPrice(eventId: string): number | undefined {
    const leastExpensiveTicket = this.allTickets()
      ?.filter((ticket) => ticket.eventId === eventId)
      .reduce((a, b) => (a.price < b.price ? a : b));
    return leastExpensiveTicket?.price;
  }

  // Get available tickets in ticket by eventId
  getAvailableTickets(eventId: string): number {
    const ticketPool = this.ticketPoolCache.get(eventId);
    return ticketPool ? ticketPool.availableTickets : 0;
  }
}
