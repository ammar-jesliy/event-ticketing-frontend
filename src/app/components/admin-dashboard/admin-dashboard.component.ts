/**
 * AdminDashboardComponent is responsible for displaying the admin dashboard.
 * It fetches and displays data related to ticket pools, tickets, customers, vendors, and events.
 * It also provides methods to calculate various statistics such as total sold tickets, available tickets, total revenue, and more.
 */

import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { Ticketpool } from '../../util/ticketpool';
import { TicketpoolService } from '../../services/ticketpool.service';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../util/ticket';
import { Customer } from '../../util/customer';
import { CustomerService } from '../../services/customer.service';
import { Vendor } from '../../util/vendor';
import { VendorService } from '../../services/vendor.service';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { EventService } from '../../services/event.service';
import { Event } from '../../util/event';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    TooltipModule,
    CommonModule,
    PieChartComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  allTicketPools: Signal<Ticketpool[] | null>;
  allTickets: Signal<Ticket[] | null>;
  allCustomers: Signal<Customer[] | null>;
  allVendors: Signal<Vendor[] | null>;
  allEvents: Signal<Event[] | null>;

  constructor(
    private ticketpoolService: TicketpoolService,
    private ticketService: TicketService,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private eventService: EventService
  ) {
    this.allTicketPools = this.ticketpoolService.allTicketPools;
    this.allTickets = this.ticketService.allTickets;
    this.allCustomers = this.customerService.allCustomers;
    this.allVendors = this.vendorService.allVendors;
    this.allEvents = this.eventService.allEvents;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * This method is used to fetch all necessary data for the admin dashboard.
   * It fetches ticket pools, tickets, customers, vendors, and events from their respective services.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.ticketpoolService.fetchAllTicketPools();
    this.ticketService.fetchAllTickets();
    this.customerService.fetchAllCustomers();
    this.vendorService.fetchAllVendors();
    this.eventService.fetchAllEvents();
  }

  /**
   * Calculates the total number of sold tickets from all ticket pools.
   *
   * @returns {number} The total number of sold tickets. Returns 0 if there are no ticket pools.
   */
  getTotalSoldTickets(): number {
    const ticketPools = this.allTicketPools();
    if (!ticketPools) {
      return 0;
    }
    return ticketPools.reduce(
      (acc, ticketPool) => acc + ticketPool.ticketSold,
      0
    );
  }

  /**
   * Calculates the total number of available tickets from all ticket pools.
   *
   * @returns {number} The total number of available tickets. Returns 0 if there are no ticket pools.
   */
  getTotalAvailableTickets(): number {
    const ticketPools = this.allTicketPools();
    if (!ticketPools) {
      return 0;
    }
    return ticketPools.reduce(
      (acc, ticketPool) => acc + ticketPool.availableTickets,
      0
    );
  }

  /**
   * Calculates the total revenue generated from sold tickets.
   *
   * This method iterates over all tickets and sums up the prices of the tickets that are not available (i.e., sold).
   *
   * @returns {number} The total revenue from sold tickets. If there are no tickets, returns 0.
   */
  getTotalRevenue(): number {
    const tickets = this.allTickets();
    if (!tickets) {
      return 0;
    }
    return tickets.reduce(
      (acc, ticket) => (ticket.available ? acc : acc + ticket.price),
      0
    );
  }

  /**
   * Calculates the total number of users by summing the number of customers and vendors.
   *
   * @returns {number} The total number of users.
   */
  getTotalUsers(): number {
    const customers = this.allCustomers();
    const vendors = this.allVendors();
    const customerCount = customers ? customers.length : 0;
    const vendorCount = vendors ? vendors.length : 0;
    return customerCount + vendorCount;
  }

  /**
   * Retrieves the most recent events.
   *
   * This method fetches all events and sorts them in descending order based on their date.
   * It then returns the top 4 most recently created events.
   *
   * @returns {Event[]} An array of the 4 most recent events. If no events are available, an empty array is returned.
   */
  getRecentEvents(): Event[] {
    const events = this.allEvents();
    if (!events) {
      return [];
    }
    const sortedEvents = events.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return sortedEvents.slice(0, 4);
  }

  /**
   * Retrieves the number of tickets sold for a specific event.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {number} The number of tickets sold for the event. Returns 0 if the event is not found.
   */
  getTicketsSold(eventId: string): number {
    const ticketPools = this.allTicketPools();
    const ticketPool = ticketPools?.find(
      (ticketPool) => ticketPool.eventId === eventId
    );
    return ticketPool ? ticketPool.ticketSold : 0;
  }

  /**
   * Retrieves the number of available tickets for a given event.
   *
   * @param {string} eventId - The unique identifier of the event.
   * @returns {number} The number of available tickets for the specified event.
   *                    Returns 0 if the event is not found or if there are no available tickets.
   */
  getTicketsAvailable(eventId: string): number {
    const ticketPools = this.allTicketPools();
    const ticketPool = ticketPools?.find(
      (ticketPool) => ticketPool.eventId === eventId
    );
    return ticketPool ? ticketPool.availableTickets : 0;
  }

  // Get the percentage of tickets sold in a ticket pool of an event, takes eventId as parameter
  /**
   * Calculates the percentage of tickets sold for a given event.
   *
   * @param {string} eventId - The ID of the event for which to calculate the tickets sold percentage.
   * @returns {number} The percentage of tickets sold for the specified event. Returns 0 if the event is not found or if there are no tickets available.
   */
  getTicketsSoldPercentage(eventId: string): number {
    const ticketPool = this.allTicketPools()?.find(
      (ticketPool) => ticketPool.eventId === eventId
    );
    if (!ticketPool) {
      return 0;
    }
    if (ticketPool.ticketSold + ticketPool.availableTickets === 0) {
      return 0;
    }
    return (
      (ticketPool.ticketSold /
        (ticketPool.ticketSold + ticketPool.availableTickets)) *
      100
    );
  }
}
