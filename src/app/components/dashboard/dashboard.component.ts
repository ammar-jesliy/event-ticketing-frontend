/**
 * Represents the dashboard component of the event ticketing application.
 * This component is responsible for displaying various statistics and information
 * related to tickets, transactions, and events.
 * This component is only accessible to authenticated vendors.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
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

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a component.
   * This method is used to load vendor data from storage, fetch tickets and transactions by vendor ID,
   * and fetch all events.
   *
   */
  ngOnInit() {
    this.vendorService.loadVendorFromStorage();
    this.ticketService.fetchTicketsByVendorId(this.vendorDetails()?.id || '');
    this.transactionService.fetchTransactionsByVendorId(
      this.vendorDetails()?.id || ''
    );
    this.eventService.fetchAllEvents();
  }

  /**
   * Calculates the total number of tickets that have been sold by the vendor.
   *
   * @returns {number} The total number of sold tickets. If no tickets are available, returns 0.
   */
  getTotalSoldTickets(): number {
    return (
      this.vendorTickets()?.filter((ticket) => !ticket.available).length || 0
    );
  }

  /**
   * Calculates the total number of available tickets released by the vendor.
   *
   * @returns {number} The total count of tickets that are available.
   */
  getTotalAvailableTickets(): number {
    return (
      this.vendorTickets()?.filter((ticket) => ticket.available).length || 0
    );
  }

  /**
   * Calculates the total revenue from sold tickets.
   *
   * This method iterates over the list of vendor tickets and sums up the prices
   * of all tickets that are not available (i.e., sold). If there are no tickets
   * or the list is undefined, it returns 0.
   *
   * @returns {number} The total revenue from sold tickets.
   */
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

  /**
   * Calculates the total number of unique customers who have purchased tickets.
   *
   * @returns {number} The total number of unique customers.
   */
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

  /**
   * Retrieves the most recent transactions of type 'RELEASE'.
   *
   * This method filters the vendor transactions to include only those with a
   * transaction type of 'RELEASE', sorts them in descending order based on the
   * timestamp, and returns the top 4 most recent transactions.
   *
   * @returns {Transaction[]} An array of the 4 most recent 'RELEASE' transactions,
   * or an empty array if there are no such transactions.
   */
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

  /**
   * Retrieves the count of sold tickets for a specific event.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {number} The number of tickets that have been sold for the specified event.
   */
  getSoldTicketsCount(eventId: string): number {
    return (
      this.vendorTickets()?.filter(
        (ticket) => ticket.eventId === eventId && !ticket.available
      ).length || 0
    );
  }

  /**
   * Calculates the percentage of tickets sold for a specific event.
   *
   * @param eventId - The unique identifier of the event.
   * @param transactionId - The unique identifier of the transaction.
   * @returns The percentage of tickets sold as a number.
   */
  getPercentageSold(eventId: string, transactionId: string): number {
    const totalTickets = this.vendorTransactions()?.find(
      (transaction) => transaction.id === transactionId
    )?.quantity;

    const soldTickets = this.getSoldTicketsCount(eventId);
    return (soldTickets / totalTickets!) * 100;
  }

  /**
   * Retrieves the name of an event based on its ID.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {string} The name of the event if found, otherwise an empty string.
   */
  getEventName(eventId: string): string {
    return this.allEvents()?.find((event) => event.id === eventId)?.name || '';
  }

  /**
   * Retrieves the date of an event based on the provided event ID.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {string} The date of the event as a string, or an empty string if the event is not found.
   */
  getEventDate(eventId: string): string {
    return this.allEvents()?.find((event) => event.id === eventId)?.date || '';
  }
}
