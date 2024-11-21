import { Component } from '@angular/core';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { HeaderComponent } from '../header/header.component';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
