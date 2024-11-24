import { Component } from '@angular/core';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-buy-tickets',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.css'
})
export class BuyTicketsComponent {

}
