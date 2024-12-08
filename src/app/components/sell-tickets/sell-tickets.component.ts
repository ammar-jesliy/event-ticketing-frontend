/**
 * SellTicketsComponent is responsible for handling the selling of tickets for events.
 * It provides functionalities to display a form for selling tickets, validate the form,
 * and submit the form to release tickets for a specific event by the vendor.
 *
 * This component is only accessible to vendors.
 */

import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../util/event';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../services/vendor.service';
import { Transaction } from '../../util/transaction';
import { TransactionService } from '../../services/transaction.service';
import { TooltipModule } from 'primeng/tooltip';
import { Ticket } from '../../util/ticket';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-sell-tickets',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
  ],
  templateUrl: './sell-tickets.component.html',
  styleUrl: './sell-tickets.component.css',
})
export class SellTicketsComponent implements OnInit {
  sellTicketsForm!: FormGroup;

  eventNames: Signal<string[] | null>;
  allEvents: Signal<Event[] | null>;
  transactions: Signal<Transaction[] | null>;
  tickets: Signal<Ticket[] | null>;

  formVisible: boolean = false;

  constructor(
    private eventService: EventService,
    private vendorService: VendorService,
    private transactionService: TransactionService,
    private ticketService: TicketService,
    private fb: FormBuilder
  ) {
    this.eventNames = this.eventService.eventNames;
    this.allEvents = this.eventService.allEvents;
    this.transactions = this.transactionService.vendorTransactions;
    this.tickets = this.ticketService.vendorTickets;
  }

  /**
   * Initializes the component by fetching necessary data and setting up the form.
   *
   * - Retrieves the vendor ID from the local storage.
   * - Fetches all events using the event service.
   * - Fetches transactions by vendor ID using the transaction service.
   * - Fetches tickets by vendor ID using the ticket service.
   * - Initializes the sell tickets form with form controls for event name, ticket price, and ticket quantity.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    const vendorId = JSON.parse(localStorage.getItem('user') || '{}').id;

    this.eventService.fetchAllEvents();
    this.transactionService.fetchTransactionsByVendorId(vendorId);
    this.ticketService.fetchTicketsByVendorId(vendorId);

    this.sellTicketsForm = this.fb.group({
      eventName: ['', Validators.required],
      ticketPrice: ['', Validators.required],
      ticketQuantity: ['', Validators.required],
    });
  }

  showDialog() {
    this.formVisible = true;
  }

  /**
   * Handles the form submission for selling tickets.
   *
   * This method performs the following actions:
   * 1. Validates the form.
   * 2. Extracts event name, ticket price, and ticket quantity from the form.
   * 3. Retrieves the vendor ID from local storage.
   * 4. Finds the event ID based on the event name.
   * 5. If the event ID is not found, logs an error and marks all form fields as touched.
   * 6. If the event ID is found, releases the tickets using the vendor service.
   * 7. Resets the form and hides it upon successful submission.
   *
   * @returns {void}
   */

  onSubmit() {
    if (this.sellTicketsForm.valid) {
      const { eventName, ticketPrice, ticketQuantity } =
        this.sellTicketsForm.value;

      // Get vendorId from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const vendorId = user?.id;

      // Get eventId
      const eventId: string =
        this.allEvents()?.find((event) => event.name === eventName)?.id || '';

      if (!eventId || eventId === '') {
        console.error('Event not found');
        this.sellTicketsForm.markAllAsTouched();
        return;
      }

      // Release the tickets
      this.vendorService.releaseTicket(
        eventId,
        vendorId,
        ticketPrice,
        ticketQuantity
      );

      this.formVisible = false;
      this.sellTicketsForm.reset();
    } else {
      this.sellTicketsForm.markAllAsTouched();
    }
  }

  /**
   * Retrieves the name of an event based on the provided event ID.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {string} The name of the event if found, otherwise an empty string.
   */
  getEventName(eventId: string) {
    return this.allEvents()?.find((event) => event.id === eventId)?.name || '';
  }

  /**
   * Retrieves the names of events that are ongoing but have not yet been released by the current vendor.
   *
   * This method filters through all events and returns the names of those events
   * that are currently ongoing and have not been released by the current vendor.
   *
   * @returns {string[]} An array of event names that are ongoing and unreleased.
   */
  getUnreleasedEventNames() {
    const releasedEventIds =
      this.transactions()?.map((transaction) => transaction.eventId) || [];
    const ongoingEventNames = this.getOngoingEventNames();
    return (
      this.allEvents()
        ?.filter(
          (event) =>
            event.id &&
            !releasedEventIds.includes(event.id) &&
            ongoingEventNames.includes(event.name)
        )
        .map((event) => event.name) || []
    );
  }

  /**
   * Retrieves the list of transactions that have a transaction type of 'RELEASE'.
   *
   * @returns {Array} An array of transactions filtered by the 'RELEASE' transaction type.
   */
  getReleaseTransactions() {
    return (
      this.transactions()?.filter(
        (transaction) => transaction.transactionType === 'RELEASE'
      ) || []
    );
  }

  /**
   * Retrieves the close date of an event based on the provided event ID.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {string} The close date of the event if found, otherwise an empty string.
   */
  getEventCloseDate(eventId: string) {
    return (
      this.allEvents()?.find((event) => event.id === eventId)?.closeDate || ''
    );
  }

  /**
   * Sorts an array of transactions by the close date of the associated events in descending order.
   *
   * @param transactions - An array of transactions to be sorted.
   * @returns The sorted array of transactions, with the transactions associated with the latest event close dates appearing first.
   */
  sortTransactionsByEventCloseDate(transactions: Transaction[]) {
    return transactions.sort((a, b) => {
      const eventACloseDate = new Date(
        this.getEventCloseDate(a.eventId)
      ).getTime();
      const eventBCloseDate = new Date(
        this.getEventCloseDate(b.eventId)
      ).getTime();
      return eventBCloseDate - eventACloseDate;
    });
  }

  /**
   * Retrieves the names of ongoing events.
   *
   * This method filters the list of all events to find those that are currently ongoing,
   * i.e., events whose open date is in the past and close date is in the future.
   *
   * @returns {string[]} An array of names of ongoing events. If no events are ongoing, returns an empty array.
   */
  getOngoingEventNames() {
    return (
      this.allEvents()
        ?.filter((event) => {
          const currentDate = new Date().getTime();
          return (
            new Date(event.closeDate).getTime() > currentDate &&
            new Date(event.openDate).getTime() <= currentDate
          );
        })
        .map((event) => event.name) || []
    );
  }

  /**
   * Determines the status of an event based on its close date.
   *
   * @param eventId - The unique identifier of the event.
   * @returns A string indicating the status of the event:
   *          - 'Closed' if the event's close date is in the past.
   *          - 'Ongoing' if the event's close date is in the future.
   *          - An empty string if the event is not found.
   */
  getEventStatus(eventId: string) {
    const currentDate = new Date().getTime();
    const event = this.allEvents()?.find((event) => event.id === eventId);

    if (!event) {
      return '';
    }

    if (new Date(event.closeDate).getTime() < currentDate) {
      return 'Closed';
    } else {
      return 'Ongoing';
    }
  }

  /**
   * Determines the background color based on the event's status.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {string} - Returns 'bg-red-500' if the event is closed, 'bg-blue-500' if the event is open, or an empty string if the event is not found.
   */
  getEventStatusColor(eventId: string) {
    const currentDate = new Date().getTime();
    const event = this.allEvents()?.find((event) => event.id === eventId);

    if (!event) {
      return '';
    }

    if (new Date(event.closeDate).getTime() < currentDate) {
      return 'bg-red-500';
    } else {
      return 'bg-blue-500';
    }
  }

  /**
   * Retrieves the count of sold tickets for a specific event.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {number} The number of tickets that have been sold for the specified event.
   */
  getSoldTicketsCount(eventId: string): number {
    return (
      this.tickets()?.filter(
        (ticket) => ticket.eventId === eventId && !ticket.available
      ).length || 0
    );
  }
}
