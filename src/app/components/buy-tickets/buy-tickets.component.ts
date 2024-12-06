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
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-buy-tickets',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    CommonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
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
      ?.filter((ticket) => ticket.eventId === eventId && ticket.available)
      .reduce((a, b) => (a.price > b.price ? a : b));
    return mostExpensiveTicket?.price;
  }

  // Get least expensive ticket price of a given event
  getLeastExpensiveTicketPrice(eventId: string): number | undefined {
    const leastExpensiveTicket = this.allTickets()
      ?.filter((ticket) => ticket.eventId === eventId && ticket.available)
      .reduce((a, b) => (a.price < b.price ? a : b));
    return leastExpensiveTicket?.price;
  }

  // Get available tickets in ticket by eventId
  getAvailableTickets(eventId: string): number {
    const ticketPool = this.ticketPoolCache.get(eventId);
    return ticketPool ? ticketPool.availableTickets : 0;
  }

  // Get total price of tickets by getting the quantity and eventId as parameters, calculate the total price by adding from the least expensive tickets in the ticketpool tickets
  getTotalPrice(quantity: number, eventId: string): number {
    const ticketPool = this.ticketPoolCache.get(eventId);
    if (!ticketPool) {
      return 0;
    }

    const tickets = ticketPool.tickets;
    const leastExpensiveTickets = tickets.sort((a, b) => a.price - b.price);
    return leastExpensiveTickets.slice(0, quantity).reduce((acc, ticket) => {
      return acc + ticket.price;
    }, 0);
  }

  // return the count of ticket prices grouped by price by taking quantity and eventId as parameters, return a string with the count then price, for example 2 x $10
  getTicketPriceGroup(quantity: number, eventId: string): string {
    const ticketPool = this.ticketPoolCache.get(eventId);
    if (!ticketPool) {
      return '';
    }

    const tickets = ticketPool.tickets;
    const leastExpensiveTickets = tickets.sort((a, b) => a.price - b.price);
    const ticketPrices = leastExpensiveTickets
      .slice(0, quantity)
      .reduce((acc, ticket) => {
        if (acc[ticket.price]) {
          acc[ticket.price]++;
        } else {
          acc[ticket.price] = 1;
        }
        return acc;
      }, {} as { [key: number]: number });

    return Object.keys(ticketPrices)
      .map((price) => `${ticketPrices[Number(price)]} x Rs. ${price}`)
      .join(', ');
  }
}
