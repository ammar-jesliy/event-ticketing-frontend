/**
 * Component for buying tickets.
 *
 * This component allows users to select events and purchase tickets. It fetches events and tickets from the respective services,
 * manages the state of the selected event, and handles the form submission for buying tickets.
 *
 */

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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule
  ],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.css',
  providers: [MessageService],
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
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.allEvents = this.eventService.allEvents;
    this.allTickets = this.ticketService.allTickets;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Initializes the component by fetching all events and tickets, and setting up the form group.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    // Fetch all events
    this.eventService.fetchAllEvents();
    this.ticketService.fetchAllTickets();

    this.buyTicketForm = this.fb.group({
      quantity: ['', Validators.required],
    });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tickets purchased successfully',
    });
  }

  /**
   * Handles the click event for selecting an event.
   *
   * @param eventId - The unique identifier of the event to be selected.
   * @returns void
   */
  onClick(eventId: string) {
    this.selectedEvent = this.allEvents()?.find(
      (event) => event.id === eventId
    );
    this.displayDialog = true;
  }

  /**
   * Handles the form submission for buying tickets.
   *
   * This method checks if the form is valid and an event is selected. If both conditions are met,
   * it extracts the quantity of tickets from the form, retrieves the customer ID from local storage,
   * and the event ID from the selected event. It then calls the `buyTickets` method of the
   * `customerService` to purchase the tickets. After the purchase, it hides the dialog and resets the form.
   * If the form is invalid, it marks all form controls as touched to display validation errors.
   */
  onSubmit() {
    if (this.buyTicketForm.valid && this.selectedEvent) {
      const { quantity } = this.buyTicketForm.value;
      const customerId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const eventId = this.selectedEvent.id || '';

      // Buy tickets
      this.customerService
        .buyTickets(eventId, customerId, quantity)
        .subscribe(() => {
          this.showSuccess();
        });
      this.displayDialog = false;
      this.buyTicketForm.reset();
    } else {
      this.buyTicketForm.markAllAsTouched();
    }
  }

  /**
   * Retrieves a list of events that have available tickets.
   *
   * This method first ensures that the ticket pool for each event is fetched and cached.
   * It then filters the events to include only those that have tickets available.
   *
   * @returns {Event[]} An array of events that have available tickets.
   */
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

  /**
   * Fetches the ticket pool for a given event ID and caches it.
   * If the ticket pool for the specified event ID is already cached, it does nothing.
   * Otherwise, it fetches the ticket pool from the service and stores it in the cache.
   *
   * @param eventId - The ID of the event for which to fetch the ticket pool.
   */
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
  /**
   * Retrieves the price of the most expensive available ticket for a given event.
   *
   * @param eventId - The unique identifier of the event.
   * @returns The price of the most expensive available ticket, or `undefined` if no tickets are available.
   */
  getMostExpensiveTicketPrice(eventId: string): number | undefined {
    const mostExpensiveTicket = this.allTickets()
      ?.filter((ticket) => ticket.eventId === eventId && ticket.available)
      .reduce((a, b) => (a.price > b.price ? a : b));
    return mostExpensiveTicket?.price;
  }

  /**
   * Retrieves the price of the least expensive available ticket for a given event.
   *
   * @param eventId - The unique identifier of the event.
   * @returns The price of the least expensive available ticket, or `undefined` if no tickets are available.
   */
  getLeastExpensiveTicketPrice(eventId: string): number | undefined {
    const leastExpensiveTicket = this.allTickets()
      ?.filter((ticket) => ticket.eventId === eventId && ticket.available)
      .reduce((a, b) => (a.price < b.price ? a : b));
    return leastExpensiveTicket?.price;
  }

  /**
   * Retrieves the number of available tickets for a given event.
   *
   * @param eventId - The unique identifier of the event.
   * @returns The number of available tickets for the specified event. Returns 0 if the event is not found in the ticket pool cache.
   */
  getAvailableTickets(eventId: string): number {
    const ticketPool = this.ticketPoolCache.get(eventId);
    return ticketPool ? ticketPool.availableTickets : 0;
  }

  /**
   * Calculates the total price for a given quantity of tickets for a specific event.
   * It selects the least expensive tickets available in the ticket pool.
   *
   * @param {number} quantity - The number of tickets to purchase.
   * @param {string} eventId - The ID of the event for which tickets are being purchased.
   * @returns {number} - The total price for the specified quantity of tickets.
   */
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

  /**
   * Retrieves a string representation of the ticket price group for a given quantity and event ID.
   *
   * @param quantity - The number of tickets to be purchased.
   * @param eventId - The unique identifier of the event.
   * @returns A string that describes the quantity of tickets at each price point, formatted as "quantity x Rs. price".
   *          Returns an empty string if the ticket pool for the given event ID is not found.
   */
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
