import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Transaction } from '../util/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/v1/transactions';

  private _allTransactions = signal<Transaction[]>([]);
  private _vendorTransactions = signal<Transaction[]>([]);

  constructor(private http: HttpClient) {}

  get allTransactions() {
    return this._allTransactions.asReadonly();
  }

  get vendorTransactions() {
    return this._vendorTransactions.asReadonly();
  }

  fetchAllTransactions() {
    this.http
      .get<Transaction[]>(`${this.apiUrl}`)
      .subscribe((transactions) => {
        console.log('Fetched transactions: ', transactions);
        this._allTransactions.set(transactions);
      });
  }

  fetchTransactionsByVendorId(vendorId: string) {
    this.http
      .get<Transaction[]>(`${this.apiUrl}/vendor/${vendorId}`)
      .subscribe((transactions) => {
        console.log('Fetched vendor transactions: ', transactions);
        this._vendorTransactions.set(transactions);
      });
  }
}
