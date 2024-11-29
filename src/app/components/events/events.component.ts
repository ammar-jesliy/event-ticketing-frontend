import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import {
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
      date: ['', [Validators.required]],
      location: ['', Validators.required],
      maxCapacity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(500000)],
      ],
    });

    console.log(this.allEvents());
  }

  showDialog() {
    this.formVisible = true;
    console.log('Show Dialog');
  }

  onSubmit() {
    if (this.createEventForm.valid) {
      const { name, description, date, location, maxCapacity } =
        this.createEventForm.value;

      const newDate = new Date(date);

      const newEvent: Event = {
        name,
        description,
        date: newDate.toISOString(),
        location,
        maxCapacity,
      }

      this.eventService.createEvent(newEvent);
    }

    console.log('Submit');
    this.formVisible = false;
  }
}
