import { Component } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

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
    FormsModule,
    InputNumberModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {
  date: Date | undefined;
  formVisible: boolean = false;

  showDialog() {
    this.formVisible = true;
    console.log('Show Dialog');
  }
}
