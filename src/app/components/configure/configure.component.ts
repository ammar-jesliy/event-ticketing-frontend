/**
 * This file contains the ConfigureComponent class, which is responsible for
 * configuring event ticketing settings. It uses Angular's reactive forms to handle user input
 * and communicates with the ConfigurationService to fetch and update configuration details.
 * The component also provides user feedback through PrimeNG's MessageService.
 *
 */

import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { ConfigurationService } from '../../services/configuration.service';
import { Configuration } from '../../util/configuration';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './configure.component.html',
  styleUrl: './configure.component.css',
  providers: [MessageService],
})
export class ConfigureComponent implements OnInit {
  form: FormGroup;

  /**
   * A writable signal that holds the configuration details.
   * Initially set to null, it can be updated with a Configuration object.
   */
  configDetails: WritableSignal<Configuration | null> = signal(null);

  constructor(
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      maxCapacity: ['', Validators.required],
      releaseRate: ['', Validators.required],
      retrievalRate: ['', Validators.required],
    });
  }

  /**
   * Displays a success message indicating that the configuration has been updated successfully.
   * Utilizes the message service to add a message with severity 'success', a summary of 'Success',
   * and a detailed message of 'Configuration updated successfully'.
   */
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Configuration updated successfully',
    });
  }

  /**
   * Initializes the component by fetching configuration details from the configuration service
   * and setting up the reactive form with the fetched configuration values.
   *
   * This method is called once, after the component's view has been fully initialized.
   * It subscribes to the configuration service to get the configuration details and
   * sets the form controls with the retrieved values.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.configurationService.getConfiguration().subscribe((config) => {
      this.configDetails.set(config);
      this.form = this.fb.group({
        maxCapacity: [this.configDetails()?.maxCapacity, Validators.required],
        releaseRate: [this.configDetails()?.releaseRate, Validators.required],
        retrievalRate: [
          this.configDetails()?.retrievalRate,
          Validators.required,
        ],
      });
    });
  }

  /**
   *
   * This method retrieves `maxCapacity`, `releaseRate`, and `retrievalRate`
   * from the form's value, constructs a `Configuration` object, and
   * calls `updateConfiguration` on the `configurationService` with the
   * updated configuration. It then calls `showSuccess` to indicate
   * the successful update.
   */
  saveConfiguration() {
    const { maxCapacity, releaseRate, retrievalRate } = this.form.value;
    const updatedConfig: Configuration = {
      maxCapacity,
      releaseRate,
      retrievalRate,
    };

    this.configurationService.updateConfiguration(updatedConfig);
    this.showSuccess();
  }
}
