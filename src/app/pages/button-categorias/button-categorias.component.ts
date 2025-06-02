import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-button-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-categorias.component.html',
  styleUrls: ['./button-categorias.component.css']
})
export class ButtonCategoriasComponent implements OnInit {
  mostrarMenu: boolean = false;
  categorias: any[] = [];
  cargando: boolean = false;

  private timeoutId: any;

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  async obtenerCategorias(): Promise<void> {
    this.cargando = true;
    this.categorias = await this.categoriasService.getCategorias();
    this.cargando = false;
  }

  mostrar(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.mostrarMenu = true;
  }

  ocultar(): void {
    this.timeoutId = setTimeout(() => {
      this.mostrarMenu = false;
    }, 100);
  }

  handleClick(categoria: any): void {
    console.log('➡️ Clic en categoría:', categoria.nombre);
    // Aquí podrías navegar con router si quieres
  }
}
