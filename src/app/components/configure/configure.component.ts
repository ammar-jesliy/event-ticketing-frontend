import { Component } from '@angular/core';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './configure.component.html',
  styleUrl: './configure.component.css'
})
export class ConfigureComponent {

}
