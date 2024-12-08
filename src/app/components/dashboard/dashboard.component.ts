import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { TooltipModule } from 'primeng/tooltip';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../util/vendor';
import { Ticket } from '../../util/ticket';
import { TicketService } from '../../services/ticket.service';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../util/transaction';
import { EventService } from '../../services/event.service';
import { Event } from '../../util/event';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    HomeTemplateComponent,
    TooltipModule,
    PieChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  vendorDetails: Signal<Vendor | null>;
  vendorTickets: Signal<Ticket[] | null>;
  vendorTransactions: Signal<Transaction[] | null>;
  allEvents: Signal<Event[] | null>;

  constructor(
    private vendorService: VendorService,
    private ticketService: TicketService,
    private transactionService: TransactionService,
    private eventService: EventService
  ) {
    this.vendorDetails = this.vendorService.vendorDetails;
    this.vendorTickets = this.ticketService.vendorTickets;
    this.vendorTransactions = this.transactionService.vendorTransactions;
    this.allEvents = this.eventService.allEvents;
  }

  ngOnInit() {
    this.vendorService.loadVendorFromStorage();
    this.ticketService.fetchTicketsByVendorId(this.vendorDetails()?.id || '');
    this.transactionService.fetchTransactionsByVendorId(
      this.vendorDetails()?.id || ''
    );
    this.eventService.fetchAllEvents();
  }

  // Calculate the total tickets with available as false
  getTotalSoldTickets(): number {
    return (
      this.vendorTickets()?.filter((ticket) => !ticket.available).length || 0
    );
  }

  // Calculate the total tickets with available as true
  getTotalAvailableTickets(): number {
    return (
      this.vendorTickets()?.filter((ticket) => ticket.available).length || 0
    );
  }

  // Calculate the total price of all sold tickets
  getTotalRevenue(): number {
    return (
      this.vendorTickets()?.reduce((total, ticket) => {
        if (!ticket.available) {
          return total + ticket.price;
        }
        return total;
      }, 0) || 0
    );
  }

  // Calculate the total number of unique customer who bought tickets using the customer ids in each ticket with available as false
  getTotalCustomers(): number {
    return (
      this.vendorTickets()?.reduce((customers, ticket) => {
        if (
          !ticket.available &&
          ticket.customerId &&
          !customers.includes(ticket.customerId)
        ) {
          customers.push(ticket.customerId);
        }
        return customers;
      }, [] as string[]).length || 0
    );
  }

  // Return the transactions with transactionType = "RELEASE" in the vendorTransactions signal array, sort by date in descending order and return the first 4 transactions
  getRecentTransactions(): Transaction[] {
    return (
      this.vendorTransactions()
        ?.filter((transaction) => transaction.transactionType === 'RELEASE')
        .sort((a, b) => {
          return (
            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
          );
        })
        .slice(0, 4) || []
    );
  }

  // Get the total number of tickets with isAvailable = false for a given eventId
  getSoldTicketsCount(eventId: string): number {
    return (
      this.vendorTickets()?.filter(
        (ticket) => ticket.eventId === eventId && !ticket.available
      ).length || 0
    );
  }

  // Get the percentage of tickets sold for an event release, divide the number of sold tickets by the number of tickets released for the event from the transactions amount, take eventId and transactionId as parameter ang get sold tickets from the getSoldTicketsCount method
  getPercentageSold(eventId: string, transactionId: string): number {
    const totalTickets = this.vendorTransactions()?.find(
      (transaction) => transaction.id === transactionId
    )?.quantity;

    const soldTickets = this.getSoldTicketsCount(eventId);
    return (soldTickets / totalTickets!) * 100;
  }

  // Get the event name by eventId
  getEventName(eventId: string): string {
    return this.allEvents()?.find((event) => event.id === eventId)?.name || '';
  }

  // Get the event date by eventId
  getEventDate(eventId: string): string {
    return this.allEvents()?.find((event) => event.id === eventId)?.date || '';
  }
}
