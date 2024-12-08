import { Component, OnInit, signal, Signal } from '@angular/core';
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

  getEventName(eventId: string) {
    return this.allEvents()?.find((event) => event.id === eventId)?.name || '';
  }

  // Get all event names that are ongoing and have not been released once by the vendor yet
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

  // Get all transactions that are of type 'RELEASE'
  getReleaseTransactions() {
    return (
      this.transactions()?.filter(
        (transaction) => transaction.transactionType === 'RELEASE'
      ) || []
    );
  }

  // Get event close date by eventId
  getEventCloseDate(eventId: string) {
    return (
      this.allEvents()?.find((event) => event.id === eventId)?.closeDate || ''
    );
  }

  // Sort transactions by event close date
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

  // Get ongoing event names (events that are open and have not closed yet)
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

  // Get event status by eventId
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

  // Get event status color by eventId
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

  // Get the total number of tickets with isAvailable = false for a given eventId
  getSoldTicketsCount(eventId: string): number {
    return (
      this.tickets()?.filter(
        (ticket) => ticket.eventId === eventId && !ticket.available
      ).length || 0
    );
  }
}
