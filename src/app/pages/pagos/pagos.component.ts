import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { EnvioComponent } from '../envio/envio.component'; // 👈 Importa tu EnvioComponent

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, EnvioComponent],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  totalCarrito: number = 0;
  cantidadSeleccionada: number = 0;

  mostrarModalEnvio = false; // 👈 Nueva bandera para abrir/cerrar modal

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.seleccionados$.subscribe(seleccionados => {
      this.totalCarrito = seleccionados.reduce(
        (acc, item) => acc + item.precioUnitario * item.cantidad,
        0
      );
      this.cantidadSeleccionada = seleccionados.length;
    });
  }

  continuarPago(): void {
  if (this.totalCarrito > 0) {
    console.log('🔒 Guardando snapshot de seleccionados...');
    this.carritoService.actualizarSeleccionados(this.carritoService.getSeleccionados());
    this.mostrarModalEnvio = true; // 👈 Ahora sí abre el modal seguro
  }
}


  cerrarModalEnvio(): void {
    this.mostrarModalEnvio = false; // 👈 Cierra modal desde dentro del hijo
  }
}
