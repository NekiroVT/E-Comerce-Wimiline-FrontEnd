import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductosService } from '../../services/productos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {
  mostrarCarritoMenu: boolean = false;
  carritoPoco: any[] = [];
  cargando: boolean = false;
  totalCarrito: number = 0;
  private timeoutId: any;
  private carritoSub: Subscription | undefined;

  cantidadSeleccionada: number = 1;
  itemExistente: any = null;
  stockMaximo: number = 0;

  constructor(
    private carritoService: CarritoService,
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCarrito();

    // ✅ Solo escuchar cambios si es necesario desde otro componente (opcional)
    this.carritoSub = this.carritoService.carritoActualizado$.subscribe(() => {
      if (!this.mostrarCarritoMenu) {
        this.obtenerCarrito(); // solo si estás fuera del hover del carrito
      }
    });
  }

  ngOnDestroy(): void {
    this.carritoSub?.unsubscribe();
  }

  async obtenerCarrito(): Promise<void> {
    this.cargando = true;
    this.carritoPoco = await this.carritoService.listarPocoCarrito();
    this.carritoPoco.forEach(item => {
      item.total = item.precioUnitario * item.cantidad;
    });
    this.totalCarrito = this.carritoPoco.reduce((acc, item) => acc + item.total, 0);
    this.cargando = false;
  }

  mostrar(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.mostrarCarritoMenu = true;
    if (this.carritoPoco.length === 0) {
      this.obtenerCarrito();
    }
  }

  ocultar(): void {
    this.timeoutId = setTimeout(() => {
      this.mostrarCarritoMenu = false;
    }, 100);
  }

  async aumentarCantidad(item: any): Promise<void> {
    this.stockMaximo = await this.carritoService.obtenerStockCombinacion(item.combinacionId);

    if (item.cantidad < this.stockMaximo) {
      item.cantidad++;
      await this.actualizarCantidad(item);
    } else {
      console.log("❌ No se puede aumentar la cantidad. Stock máximo alcanzado.");
    }
  }

  async disminuirCantidad(item: any): Promise<void> {
    if (item.cantidad > 1) {
      item.cantidad--;
      await this.actualizarCantidad(item);
    } else {
      console.log("❌ No se puede disminuir más la cantidad.");
    }
  }

  private async actualizarCantidad(item: any): Promise<void> {
    try {
      await this.carritoService.actualizarCantidad(item.combinacionId, item.cantidad);
      console.log("🟢 Cantidad sincronizada con el backend");

      // 🔄 Solo actualiza el total afectado
      const nuevoTotalItem = item.precioUnitario * item.cantidad;
      const diferencia = nuevoTotalItem - (item.total || 0);
      this.totalCarrito += diferencia;
      item.total = nuevoTotalItem;

      this.animateNumberChange(nuevoTotalItem);
      this.carritoService.notificarCambioCarrito(); // 🔔 Notifica a otros componentes

    } catch (error) {
      console.error("❌ Error al actualizar cantidad:", error);
      alert("No se pudo actualizar la cantidad en el carrito.");
    }

    
    
  }


  animateNumberChange(targetValue: number): void {
    console.log(`Total actualizado para este producto: ${targetValue}`);
  }

  pagar(): void {
    console.log("🟢 Procediendo al pago...");
  }

  verCarrito(): void {
    this.router.navigate(['/carrito']);
  }
}
