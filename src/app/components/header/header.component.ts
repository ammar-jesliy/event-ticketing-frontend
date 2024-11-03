import { Component } from '@angular/core';
import { SidemenuComponent } from "../sidemenu/sidemenu.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SidemenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
