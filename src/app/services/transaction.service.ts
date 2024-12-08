/**
 * Service for handling transactions.
 *
 * This service provides methods to fetch all transactions, transactions by vendor ID,
 * and transactions by customer ID from the backend API.
 *
 */

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

  /**
   * Fetches all transactions from the API and updates the `_allTransactions` state.
   *
   * This method sends an HTTP GET request to the API endpoint specified by `apiUrl`.
   * Upon receiving the response, it updates the `_allTransactions` state with the
   * fetched transactions.
   *
   * @returns {void}
   */
  fetchAllTransactions() {
    this.http.get<Transaction[]>(`${this.apiUrl}`).subscribe((transactions) => {
      this._allTransactions.set(transactions);
    });
  }

  /**
   * Fetches transactions for a given vendor by their ID.
   *
   * @param vendorId - The unique identifier of the vendor.
   * @returns void
   */
  fetchTransactionsByVendorId(vendorId: string) {
    this.http
      .get<Transaction[]>(`${this.apiUrl}/vendor/${vendorId}`)
      .subscribe((transactions) => {
        this._vendorTransactions.set(transactions);
      });
  }

  /**
   * Fetches transactions for a given customer by their ID.
   *
   * @param customerId - The unique identifier of the customer whose transactions are to be fetched.
   * @returns void
   */
  fetchTransactionsByCustomerId(customerId: string) {
    this.http
      .get<Transaction[]>(`${this.apiUrl}/customer/${customerId}`)
      .subscribe((transactions) => {
        this._customerTransactions.set(transactions);
      });
  }
}
