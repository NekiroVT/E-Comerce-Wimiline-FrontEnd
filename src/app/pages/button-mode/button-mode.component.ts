import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-mode.component.html',
  styleUrls: ['./button-mode.component.css']
})
export class ButtonModeComponent implements OnInit {
  modoOscuro = false;

  ngOnInit(): void {
    const preferencia = localStorage.getItem('modoOscuro');
    this.modoOscuro = preferencia === 'true';
    this.aplicarModo();
  }

  toggleModo(): void {
    this.modoOscuro = !this.modoOscuro;
    localStorage.setItem('modoOscuro', String(this.modoOscuro));
    this.aplicarModo();
  }

  aplicarModo(): void {
    if (this.modoOscuro) {
      document.body.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
    }
  }
}
