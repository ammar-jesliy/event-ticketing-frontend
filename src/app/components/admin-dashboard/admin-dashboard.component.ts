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
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  allTicketPools: Signal<Ticketpool[] | null>;
  allTickets: Signal<Ticket[] | null>;
  allCustmomers: Signal<Customer[] | null>;
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
    this.allCustmomers = this.customerService.allCustomers;
    this.allVendors = this.vendorService.allVendors;
    this.allEvents = this.eventService.allEvents;
  }

  ngOnInit(): void {
    this.ticketpoolService.fetchAllTicketPools();
    this.ticketService.fetchAllTickets();
    this.customerService.fetchAllCustomers();
    this.vendorService.fetchAllVendors();
    this.eventService.fetchAllEvents();
  }

  // Get the totoal number of sold tickets in all ticket pools
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

  // Get the total number of available tickets in all ticket pools
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

  // Get the total price of all tickets in the allTickets signal array with available as false
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

  // Get the total number of users in the allCustomers and allVendors signal arrays
  getTotalUsers(): number {
    const customers = this.allCustmomers();
    const vendors = this.allVendors();
    const customerCount = customers ? customers.length : 0;
    const vendorCount = vendors ? vendors.length : 0;
    return customerCount + vendorCount;
  }

  // Sort all events by date in ascending order and only return the top 4 events
  getRecentEvents(): Event[] {
    const events = this.allEvents();
    if (!events) {
      return [];
    }
    return events
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 4);
  }

  // Get the number of tickets sold in a ticket pool of an event, takes eventId as parameter
  getTicketsSold(eventId: string): number {
    const ticketPool = this.allTicketPools()?.find(
      (ticketPool) => ticketPool.eventId === eventId
    );
    return ticketPool ? ticketPool.ticketSold : 0;
  }

  // Get the number of tickets available in a ticket pool of an event, takes eventId as parameter
  getTicketsAvailable(eventId: string): number {
    const ticketPool = this.allTicketPools()?.find(
      (ticketPool) => ticketPool.eventId === eventId
    );
    return ticketPool ? ticketPool.availableTickets : 0;
  }

  // Get the percentage of tickets sold in a ticket pool of an event, takes eventId as parameter
  getTicketsSoldPercentage(eventId: string): number {
    const ticketPool = this.allTicketPools()?.find(
      (ticketPool) => ticketPool.eventId === eventId
    );
    if (!ticketPool) {
      return 0;
    }
    if (ticketPool.ticketSold === 0 && ticketPool.availableTickets === 0) {
      return 0;
    }
    return (
      (ticketPool.ticketSold /
        (ticketPool.ticketSold + ticketPool.availableTickets)) *
      100
    );
  }
}
