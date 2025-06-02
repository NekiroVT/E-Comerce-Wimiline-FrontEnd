import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { TopBarComponent } from '../../pages/topbar/topbar.component';
import { DashboardPanelComponent } from '../dashboard-panel/dashboard-panel.component';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Necesario para usar <router-outlet>
    TopBarComponent,
    DashboardPanelComponent
  ],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.css']
})
export class PanelAdminComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  cambiarComponente(ruta: string) {
    this.router.navigate([ruta], { relativeTo: this.route });
  }
}
