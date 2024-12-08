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
  private _customerTransactions = signal<Transaction[]>([]);

  constructor(private http: HttpClient) {}

  get allTransactions() {
    return this._allTransactions.asReadonly();
  }

  get vendorTransactions() {
    return this._vendorTransactions.asReadonly();
  }

  get customerTransactions() {
    return this._customerTransactions.asReadonly();
  }

  fetchAllTransactions() {
    this.http.get<Transaction[]>(`${this.apiUrl}`).subscribe((transactions) => {
      this._allTransactions.set(transactions);
    });
  }

  fetchTransactionsByVendorId(vendorId: string) {
    this.http
      .get<Transaction[]>(`${this.apiUrl}/vendor/${vendorId}`)
      .subscribe((transactions) => {
        this._vendorTransactions.set(transactions);
      });
  }

  fetchTransactionsByCustomerId(customerId: string) {
    this.http
      .get<Transaction[]>(`${this.apiUrl}/customer/${customerId}`)
      .subscribe((transactions) => {
        this._customerTransactions.set(transactions);
      });
  }
}
