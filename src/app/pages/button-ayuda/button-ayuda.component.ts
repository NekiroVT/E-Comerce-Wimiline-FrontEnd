import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-ayuda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-ayuda.component.html',
  styleUrls: ['./button-ayuda.component.css']
})
export class ButtonAyudaComponent {
  mostrarMenu: boolean = false;
  private timeoutId: any;

  opcionesAyuda = [
    { titulo: 'Preguntas Frecuentes', ruta: '/faq' },
    { titulo: 'Contactar Soporte', ruta: '/contacto' },
    { titulo: 'Reportar Problema', ruta: '/reportar' },
    { titulo: 'Centro de Ayuda', ruta: '/ayuda' }
  ];

  constructor(private router: Router) {}

  mostrar(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.mostrarMenu = true;
  }

  ocultar(): void {
    this.timeoutId = setTimeout(() => {
      this.mostrarMenu = false;
    }, 100);
  }

  handleOpcion(opcion: any): void {
    this.router.navigate([opcion.ruta]);
    this.mostrarMenu = false;
  }
}
