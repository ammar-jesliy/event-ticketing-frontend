import { Component } from '@angular/core';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home-template',
  standalone: true,
  imports: [SidemenuComponent, HeaderComponent],
  templateUrl: './home-template.component.html',
  styleUrl: './home-template.component.css',
})
export class HomeTemplateComponent {}
