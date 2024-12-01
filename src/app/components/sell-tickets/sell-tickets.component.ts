import { Component, OnInit, Signal } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../util/event';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-sell-tickets',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    DropdownModule,
  ],
  templateUrl: './sell-tickets.component.html',
  styleUrl: './sell-tickets.component.css',
})
export class SellTicketsComponent implements OnInit {
  sellTicketsForm!: FormGroup;

  eventNames: Signal<string[] | null>;
  allEvents: Signal<Event[] | null>;

  formVisible: boolean = false;

  constructor(
    private eventService: EventService,
    private vendorService: VendorService,
    private fb: FormBuilder
  ) {
    this.eventNames = this.eventService.eventNames;
    this.allEvents = this.eventService.allEvents;
  }

  ngOnInit(): void {
    this.eventService.fetchAllEvents();

    console.log('Event Names: ', this.eventNames());

    this.sellTicketsForm = this.fb.group({
      eventName: ['', Validators.required],
      ticketPrice: ['', Validators.required],
      ticketQuantity: ['', Validators.required],
    });
  }

  showDialog() {
    this.formVisible = true;
    console.log('Show Dialog');
  }

  onSubmit() {
    if (this.sellTicketsForm.valid) {
      const { eventName, ticketPrice, ticketQuantity } =
        this.sellTicketsForm.value;

      // Get vendorId from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const vendorId = user?.id;

      // Get eventId
      const eventId: string =
        this.allEvents()?.find((event) => event.name === eventName)?.id || '';

      if (!eventId || eventId === '') {
        console.error('Event not found');
        this.sellTicketsForm.markAllAsTouched();
        return;
      }

      // Release the tickets
      this.vendorService.releaseTicket(
        eventId,
        vendorId,
        ticketPrice,
        ticketQuantity
      );

      this.formVisible = false;
      this.sellTicketsForm.reset();
    } else {
      this.sellTicketsForm.markAllAsTouched();
    }
  }
}
