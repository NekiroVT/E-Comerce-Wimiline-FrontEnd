import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-idioma',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-idioma.component.html',
  styleUrls: ['./button-idioma.component.css']
})
export class ButtonIdiomaComponent {
  mostrarMenu = false;
  timeoutId: any;

  idiomas = [
    { codigo: 'es', label: '🇪🇸 Español' },
    { codigo: 'en', label: '🇺🇸 English' },
    { codigo: 'fr', label: '🇫🇷 Français' }
  ];

  mostrar() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.mostrarMenu = true;
  }

  ocultar() {
    this.timeoutId = setTimeout(() => {
      this.mostrarMenu = false;
    }, 100);
  }

  cambiarIdioma(idioma: string): void {
  // Establecer cookie (funciona en localhost y producción)
  document.cookie = `googtrans=/es/${idioma}; path=/`;

  // Quitar el traductor actual del DOM si ya existe
  const existingFrame = document.querySelector('iframe.goog-te-banner-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Recargar limpiamente forzando nueva inicialización
  window.location.href = window.location.pathname; // fuerza reinicio sin recargar todo desde cero
}

}
