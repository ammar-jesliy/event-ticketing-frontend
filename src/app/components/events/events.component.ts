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
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  allEvents: Signal<Event[] | null>;

  createEventForm!: FormGroup;
  date: Date | undefined;

  formVisible: boolean = false;

  constructor(private eventService: EventService, private fb: FormBuilder) {
    this.allEvents = this.eventService.allEvents;
  }

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

    console.log(this.allEvents());
  }

  // Custom validator to check if the date is after a given date
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

  // Returns the status text based on the status of the event
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

  onSubmit() {
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

      this.eventService.createEvent(newEvent);
    }

    console.log('Submit');
    this.formVisible = false;
  }
}
