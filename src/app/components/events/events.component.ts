import { Component } from '@angular/core';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { HeaderComponent } from '../header/header.component';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {

}
