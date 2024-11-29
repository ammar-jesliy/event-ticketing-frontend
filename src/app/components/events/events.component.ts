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
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  allEvents: Signal<Event[] | null>;

  createEventForm!: FormGroup;
  nane: string = '';
  description: string = '';
  date: Date | undefined;
  location: string = '';
  maxCapacity: number = 0;

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

  showDialog() {
    this.formVisible = true;
    console.log('Show Dialog');
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
