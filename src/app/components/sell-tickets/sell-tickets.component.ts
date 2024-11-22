import { Component } from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-sell-tickets',
  standalone: true,
  imports: [HomeTemplateComponent, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './sell-tickets.component.html',
  styleUrl: './sell-tickets.component.css'
})
export class SellTicketsComponent {

  formVisible: boolean = false;

  showDialog() {
    this.formVisible = true;
    console.log('Show Dialog');
  }

}
