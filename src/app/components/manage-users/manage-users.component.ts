import { Component } from '@angular/core';
import { HomeTemplateComponent } from "../home-template/home-template.component";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [HomeTemplateComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {

}
