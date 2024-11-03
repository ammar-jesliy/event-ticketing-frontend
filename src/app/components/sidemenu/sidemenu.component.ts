import { Component, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [ButtonModule, SidebarModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
}

  sidemenuVisible: boolean = false;
}
