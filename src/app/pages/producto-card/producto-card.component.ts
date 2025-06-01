import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.css']
})
export class ProductoCardComponent {
  @Input() producto: any;

  getVariaciones(): string {
    return this.producto?.variaciones?.length > 0
      ? this.producto.variaciones.map((v: any) => v.nombreVariacion).join(', ')
      : 'No hay variaciones disponibles.';
  }
}
