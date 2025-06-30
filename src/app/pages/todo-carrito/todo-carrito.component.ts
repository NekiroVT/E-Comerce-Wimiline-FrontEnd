import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-carrito.component.html',
  styleUrls: ['./todo-carrito.component.css']
})
export class TodoCarritoComponent implements OnInit {
  carritoPoco: any[] = [];
  cargando: boolean = false;
  totalCarrito: number = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCarritoCompleto();
  }

  async obtenerCarritoCompleto() {
    this.cargando = true;
    try {
      this.carritoPoco = await this.carritoService.obtenerCarritoCompleto();
      for (let item of this.carritoPoco) {
        item.stock = await this.carritoService.obtenerStockCombinacion(item.combinacionId);
        item.precioUnitario = item.total / item.cantidad; // Asegurar que esté definido
      }
      this.calcularTotalCarrito();
    } catch (error) {
      console.error('❌ Error al obtener carrito completo', error);
    }
    this.cargando = false;
  }

  calcularTotalCarrito(): void {
    this.totalCarrito = this.carritoPoco.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  }

  async aumentarCantidad(item: any) {
    if (item.cantidad < item.stock) {
      item.cantidad++;
      await this.actualizarCantidad(item);
    } else {
      console.log("❌ No se puede aumentar más. Stock máximo alcanzado.");
    }
  }

  async disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      await this.actualizarCantidad(item);
    }
  }

  private async actualizarCantidad(item: any): Promise<void> {
  try {
    await this.carritoService.actualizarCantidad(item.combinacionId, item.cantidad);
    item.total = item.precioUnitario * item.cantidad;
    this.calcularTotalCarrito();

    // ✅ Si está seleccionado, actualiza la lista emitida
    if (item.seleccionado) {
      this.carritoService.actualizarSeleccionados(this.carritoPoco);
    }
  } catch (error) {
    console.error('❌ Error al actualizar cantidad', error);
  }
}



  borrarItem(item: any) {
    this.carritoService.eliminarProducto(item.combinacionId, item.usuarioId)
      .then(() => {
        console.log("🗑️ Producto eliminado");
        this.carritoPoco = this.carritoPoco.filter(i => i.combinacionId !== item.combinacionId);
        this.calcularTotalCarrito();
      })
      .catch(error => {
        console.error("❌ Error al eliminar producto", error);
      });
  }

  guardarFavoritos(item: any) {
    console.log("⭐ Producto guardado en favoritos", item);
  }

  borrarSeleccionados() {
    this.carritoPoco = this.carritoPoco.filter(item => !item.seleccionado);
    this.calcularTotalCarrito();
  }

  seleccionarTodos() {
  const todosSeleccionados = this.carritoPoco.every(item => item.seleccionado);
  this.carritoPoco.forEach(item => item.seleccionado = !todosSeleccionados);
  this.carritoService.actualizarSeleccionados(this.carritoPoco);
}

onSeleccionarIndividual(item: any) {
  item.seleccionado = !item.seleccionado;
  this.carritoService.actualizarSeleccionados(this.carritoPoco);
}


  pagar() {
    console.log("🟢 Procediendo al pago");
  }

  
}
