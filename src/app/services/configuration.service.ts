/**
 * Service to handle configuration-related operations.
 *
 * This service provides methods to fetch and update configuration settings
 * from a backend API. It uses Angular's HttpClient to make HTTP requests
 * and maintains the configuration details using a reactive signal.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Configuration } from '../util/configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private apiUrl: string = 'http://localhost:8080/api/v1/configuration';

  private _configDetails = signal<Configuration | null>(null);

  constructor(private http: HttpClient) {}

  get configDetails() {
    return this._configDetails.asReadonly();
  }

  /**
   * Fetches the configuration settings from the server.
   *
   * @returns An Observable of type Configuration containing the configuration settings.
   */
  getConfiguration() {
    return this.http.get<Configuration>(`${this.apiUrl}`);
  }

  /**
   * Updates the configuration by sending a POST request to the API.
   *
   * @param {Configuration} config - The configuration object to be updated.
   * @returns {void}
   */
  updateConfiguration(config: Configuration) {
    this.http
      .post<Configuration>(`${this.apiUrl}`, config)
      .subscribe((config) => {
        this._configDetails.set(config);
      });
  }
}
