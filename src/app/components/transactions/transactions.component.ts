import { Component } from '@angular/core';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

}
