import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Transaction } from '../../util/transaction';
import { Event } from '../../util/event';
import { TransactionService } from '../../services/transaction.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [HomeTemplateComponent, CommonModule, TooltipModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  allEvents: Signal<Event[] | null>;
  vendorTransactions: Signal<Transaction[] | []>;

  constructor(
    private transactionService: TransactionService,
    private eventService: EventService
  ) {
    this.allEvents = this.eventService.allEvents;
    this.vendorTransactions = this.transactionService.vendorTransactions;
  }

  ngOnInit(): void {
    this.eventService.fetchAllEvents();
    this.transactionService.fetchTransactionsByVendorId(
      JSON.parse(localStorage.getItem('user') || '{}').id
    );
  }

  getEventName(eventId: string) {
    return this.allEvents()?.find((event) => event.id === eventId)?.name || '';
  }

  sortByDate(transactions: Transaction[]) {
    return transactions.sort((a, b) => {
      return (
        new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
      );
    });
  }
}
