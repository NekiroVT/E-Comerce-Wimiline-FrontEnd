import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  mostrarModal = false;

  productos = [
    { id: 1, nombre: 'Camiseta Negra', precio: 49.90 },
    { id: 2, nombre: 'Zapatillas Urbanas', precio: 179.50 },
    { id: 3, nombre: 'Polo Oversize', precio: 65.00 },
  ];

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  eliminarProducto(id: number): void {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  vaciarCarrito(): void {
    this.productos = [];
    this.cerrarModal();
  }
}
