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

  // Fetch configuration details
  getConfiguration() {
    return this.http.get<Configuration>(`${this.apiUrl}`);
  }

  // Update configuration details
  updateConfiguration(config: Configuration) {
    this.http
      .post<Configuration>(`${this.apiUrl}`, config)
      .subscribe((config) => {
        this._configDetails.set(config);
      });
  }
}
