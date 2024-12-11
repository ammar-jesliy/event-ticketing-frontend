/**
 * EventsComponent is responsible for displaying and managing events.
 * It includes functionalities for fetching all events, creating new events,
 * and determining the status and status color of events based on their dates.
 *
 * This component is only accessible to the system admin.
 */

import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Event } from '../../util/event';
import { EventService } from '../../services/event.service';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    CalendarModule,
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [MessageService],
})
export class EventsComponent implements OnInit {
  allEvents: Signal<Event[] | null>;

  createEventForm!: FormGroup;
  date: Date | undefined;

  formVisible: boolean = false;

  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.allEvents = this.eventService.allEvents;
  }

  /**
   * Initializes the component by fetching all events and setting up the event creation form.
   *
   * The form includes the following fields:
   * - `name`: The name of the event (required).
   * - `description`: A description of the event (required).
   * - `date`: The date of the event (required, must be after `closeDate`).
   * - `openDate`: The date when the event opens (required).
   * - `closeDate`: The date when the event closes (required, must be after `openDate`).
   * - `location`: The location of the event (required).
   * - `maxCapacity`: The maximum capacity of the event (required, minimum 1, maximum 500000).
   */
  ngOnInit(): void {
    this.eventService.fetchAllEvents();

    this.createEventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.dateAfter('closeDate')]],
      openDate: ['', Validators.required],
      closeDate: ['', [Validators.required, this.dateAfter('openDate')]],
      location: ['', Validators.required],
      maxCapacity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(500000)],
      ],
    });
  }

  /**
   * Displays a success message indicating that the event has been created successfully.
   *
   * Utilizes the message service to add a message with severity 'success', a summary of 'Success',
   * and a detailed message of 'Event created successfully'.
   */
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Event created successfully',
    });
  }

  /**
   * Validator function to check if the control's date value is after the date value of another control.
   *
   * @param compareTo - The name of the control to compare the date value with.
   * @returns A validator function that takes an `AbstractControl` and returns a validation error object if the date is not after the compared control's date, or `null` if the validation passes.
   */
  dateAfter(compareTo: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent as FormGroup;
      if (formGroup) {
        const compareToControl = formGroup.controls[compareTo];
        if (compareToControl && control.value <= compareToControl.value) {
          return { dateAfter: true };
        }
      }
      return null;
    };
  }

  // Returns a color based on the status of the event
  /**
   * Determines the status color based on the current date and the provided start and end dates.
   *
   * @param {string} startDate - The start date of the event in ISO string format.
   * @param {string} endDate - The end date of the event in ISO string format.
   * @returns {string} - A string representing the CSS class for the status color:
   *                     - 'bg-blue-500' if the current date is before the start date.
   *                     - 'bg-green-500' if the current date is between the start and end dates.
   *                     - 'bg-red-500' if the current date is after the end date.
   */
  getStatusColor(startDate: string, endDate: string) {
    const now = new Date().toISOString();
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    if (now < start) {
      return 'bg-blue-500';
    } else if (now >= start && now <= end) {
      return 'bg-green-500';
    } else {
      return 'bg-red-500';
    }
  }

  /**
   * Determines the status of an event based on its start and end dates.
   *
   * @param startDate - The start date of the event in ISO string format.
   * @param endDate - The end date of the event in ISO string format.
   * @returns A string indicating the status of the event:
   *          - 'Upcoming' if the current date is before the start date.
   *          - 'Ongoing' if the current date is between the start and end dates.
   *          - 'Ended' if the current date is after the end date.
   */
  getStatus(startDate: string, endDate: string) {
    const now = new Date().toISOString();
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    if (now < start) {
      return 'Upcoming';
    } else if (now >= start && now <= end) {
      return 'Ongoing';
    } else {
      return 'Ended';
    }
  }

  /**
   * Handles the form submission for creating a new event.
   *
   * This method first checks if the form is valid. If valid, it extracts the form values,
   * converts the date fields to ISO string format, and creates a new event object.
   * The new event is then sent to the event service to be created.
   * Finally, it hides the form.
   *
   * @returns {void}
   */
  onSubmit(): void {
    if (this.createEventForm.valid) {
      const {
        name,
        description,
        date,
        openDate,
        closeDate,
        location,
        maxCapacity,
      } = this.createEventForm.value;

      const newDate = new Date(date);
      const newOpenDate = new Date(openDate);
      const newCloseDate = new Date(closeDate);

      const newEvent: Event = {
        name,
        description,
        date: newDate.toISOString(),
        openDate: newOpenDate.toISOString(),
        closeDate: newCloseDate.toISOString(),
        location,
        maxCapacity,
      };

      this.eventService.createEvent(newEvent).subscribe(() => {
        this.showSuccess();
        this.eventService.fetchAllEvents();
      });
    }

    this.formVisible = false;
  }
}
