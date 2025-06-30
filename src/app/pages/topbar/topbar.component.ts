import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuscadorComponent } from '../buscador/buscador.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { ButtonPerfilComponent } from '../button-perfil/button-perfil.component';
import { ButtonCategoriasComponent } from '../../pages/button-categorias/button-categorias.component';
import { ButtonAyudaComponent } from '../../pages/button-ayuda/button-ayuda.component';
import { ButtonModeComponent } from '../../pages/button-mode/button-mode.component';
import { ChatButtonComponent } from '../../pages/chatbutton/ChatButtonComponent';


@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BuscadorComponent,
    CarritoComponent,
    ButtonPerfilComponent,
    ButtonCategoriasComponent,
    ButtonAyudaComponent,
    ButtonModeComponent,
    ChatButtonComponent
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopBarComponent {
  @Input() searchQuery: string = '';
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() submit = new EventEmitter<void>();

  onSearchChange(value: string) {
    this.searchQueryChange.emit(value); // ✅ Emitimos string, no un Event
  }

  onSearchSubmit() {
    this.submit.emit();
  }
}
