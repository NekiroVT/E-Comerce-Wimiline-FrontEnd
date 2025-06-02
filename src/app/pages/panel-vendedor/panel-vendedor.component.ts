import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../pages/topbar/topbar.component';
import { DashboardPanelComponent } from '../dashboard-panel/dashboard-panel.component';

@Component({
  selector: 'app-panel-vendedor',
  standalone: true,
  imports: [CommonModule, TopBarComponent, DashboardPanelComponent],
  templateUrl: './panel-vendedor.component.html',
  styleUrls: ['./panel-vendedor.component.css']
})
export class PanelVendedorComponent {}
