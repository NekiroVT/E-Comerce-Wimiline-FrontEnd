import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { NavbarComponent } from '../../pages/navbar/navbar.component';
import { TopBarComponent } from '../../pages/topbar/topbar.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-producto-ver',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TopBarComponent, FormsModule],
  templateUrl: './producto-ver.component.html',
  styleUrls: ['./producto-ver.component.css']
})
export class ProductoVerComponent implements OnInit, OnDestroy {
  producto: any = null;
  imagenSeleccionada: string | null = null;
  todasLasImagenes: any[] = [];

  valoresPorClave: { [clave: string]: string[] } = {};
  clavesDisponibles: string[] = [];
  valoresSeleccionados: { [clave: string]: string } = {};

  precioActual: number | null = null;
  stockActual: number | null = null;

  cantidadSeleccionada: number = 1;
  cantidadOpciones: number[] = [];

  combinacionSeleccionada: any = null;
  itemExistente: any = null;


private carritoSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private carritoService: CarritoService,


  ) { }



  async ngOnInit(): Promise<void> {
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) {
    console.error('❌ No se encontró ID en la URL');
    return;
  }

  try {
    this.producto = await this.productosService.getProductoPorId(id);
    this.ordenarImagenes();
    this.agruparValoresPorClave();
    this.inicializarImagenes();

    if (this.combinacionSeleccionada) {
      await this.verificarExistenciaEnCarrito();
    }

    const spm = this.route.snapshot.queryParamMap.get('spm');
    const pvid = this.route.snapshot.queryParamMap.get('pvid');
    const ref = this.route.snapshot.queryParamMap.get('ref');
    console.log({ id, spm, pvid, ref });
  } catch (error) {
    console.error('❌ Error al cargar el producto:', error);
  }

  // 🔄 Detectar cambios en el carrito en tiempo real
  this.carritoSub = this.carritoService.carritoActualizado$.subscribe(() => {
    this.verificarExistenciaEnCarrito();
  });
}

ngOnDestroy(): void {
  this.carritoSub?.unsubscribe();
}



  ordenarImagenes(): void {
    this.todasLasImagenes = (this.producto.combinaciones || [])
      .flatMap((c: any) => c.imagenes || [])
      .sort((a: any, b: any) => a.orden - b.orden);
  }

  agruparValoresPorClave(): void {
    const mapa: { [clave: string]: Set<string> } = {};

    for (const comb of this.producto.combinaciones as any[]) {
      for (const atr of comb.atributos as any[]) {
        if (!mapa[atr.claveNombre]) {
          mapa[atr.claveNombre] = new Set();
        }
        mapa[atr.claveNombre].add(atr.valorNombre);
      }
    }

    this.valoresPorClave = {};
    for (const clave in mapa) {
      this.valoresPorClave[clave] = Array.from(mapa[clave]);
    }

    this.clavesDisponibles = Object.keys(this.valoresPorClave);


  }

  inicializarImagenes(): void {
    const principal = this.producto.combinaciones?.find((c: any) => c.esPrincipal);

    if (principal) {
      for (const atr of principal.atributos) {
        this.valoresSeleccionados[atr.claveNombre] = atr.valorNombre;
      }

      const claveControla = this.producto.claveControlaImagenes?.toLowerCase();
      const nombreClaveControla = this.obtenerNombreClave(claveControla);

      const valorControl = principal.atributos.find((a: any) => a.claveNombre === nombreClaveControla)?.valorNombre;
      if (valorControl) {
        this.imagenSeleccionada = principal.imagenes?.[0]?.urlImagen || null;
      }

      this.actualizarCombinacionSeleccionada();
      return;
    }

    // Si no hay principal, usar la primera imagen disponible
    this.imagenSeleccionada = this.todasLasImagenes?.[0]?.urlImagen || null;
  }


  seleccionarValor(clave: string, valor: string): void {
    this.valoresSeleccionados[clave] = valor;

    const claveControla = this.producto.claveControlaImagenes?.toLowerCase();
    const nombreClaveControla = this.obtenerNombreClave(claveControla);

    if (clave === nombreClaveControla) {
      const combinacion = this.producto.combinaciones.find((comb: any) =>
        comb.atributos?.some((atr: any) =>
          atr.claveNombre === clave && atr.valorNombre === valor
        )
      );
      this.imagenSeleccionada = combinacion?.imagenes?.[0]?.urlImagen || null;
    }

    this.actualizarCombinacionSeleccionada();
  }

  async actualizarCombinacionSeleccionada(): Promise<void> {
    const clavesSeleccionadas = Object.keys(this.valoresSeleccionados);

    if (clavesSeleccionadas.length !== this.clavesDisponibles.length) {
      this.precioActual = null;
      this.stockActual = null;
      this.imagenSeleccionada = null;
      this.combinacionSeleccionada = null;
      this.itemExistente = null;
      return;
    }

    const combinacion = this.producto.combinaciones.find((comb: any) =>
      comb.atributos.every((atr: any) =>
        this.valoresSeleccionados[atr.claveNombre] === atr.valorNombre
      )
    );

    this.combinacionSeleccionada = combinacion || null;

    this.precioActual = combinacion?.precio || null;
    this.stockActual = combinacion?.stock || null;
    this.imagenSeleccionada = combinacion?.imagenes?.[0]?.urlImagen || null;

    const maxStock = combinacion?.stock || 0;
    this.cantidadOpciones = Array.from({ length: maxStock }, (_, i) => i + 1);

    // 👉 Nuevo: Verifica si esta combinación ya está en el carrito
    await this.verificarExistenciaEnCarrito();
  }





  obtenerNombreClave(claveId: string): string {
    const comb = this.producto.combinaciones?.find((c: any) =>
      c.atributos?.some((a: any) =>
        a.claveId?.toLowerCase() === claveId?.toLowerCase()
      )
    );

    return comb?.atributos?.find((a: any) =>
      a.claveId?.toLowerCase() === claveId?.toLowerCase()
    )?.claveNombre || '';
  }

  getVariaciones(): string {
    return this.producto?.combinaciones?.map((c: any) =>
      c.atributos?.map((a: any) => a.valorNombre).join(' ')
    ).join(', ') || '';
  }


  async agregarAlCarrito(): Promise<void> {
    if (!this.combinacionSeleccionada || !this.cantidadSeleccionada) {
      alert("❌ Selección incompleta.");
      return;
    }

    try {
      await this.carritoService.agregarAlCarrito(
        this.combinacionSeleccionada.idCombinacion,
        this.cantidadSeleccionada
      );

    } catch (error: any) {
      console.error("❌ Error al agregar al carrito:", error);
      alert("❌ No se pudo agregar al carrito");
    }
  }

  async verificarExistenciaEnCarrito(): Promise<void> {
    try {
      const carrito = await this.carritoService.obtenerCarrito();

      const item = carrito.items.find((i: any) =>
        i.combinacionId === this.combinacionSeleccionada?.idCombinacion
      );

      if (item) {
        this.itemExistente = item;
        this.cantidadSeleccionada = item.cantidad;
      } else {
        this.itemExistente = null;
        this.cantidadSeleccionada = 1;
      }
    } catch (error) {
      console.error("❌ No se pudo verificar el carrito:", error);
      this.itemExistente = null;
    }
  }

  async aumentarCantidad(): Promise<void> {
    if (!this.itemExistente || this.cantidadSeleccionada >= this.stockActual!) return;

    this.cantidadSeleccionada++;
    await this.actualizarCantidad();
  }

  async disminuirCantidad(): Promise<void> {
    if (!this.itemExistente || this.cantidadSeleccionada <= 1) return;

    this.cantidadSeleccionada--;
    await this.actualizarCantidad();
  }

  async onCantidadCambiada(): Promise<void> {
    if (!this.itemExistente) return;
    await this.actualizarCantidad();
  }

  private async actualizarCantidad(): Promise<void> {
    try {
      await this.carritoService.actualizarCantidad(
        this.combinacionSeleccionada.idCombinacion,
        this.cantidadSeleccionada
      );
      console.log("🟢 Cantidad sincronizada con el backend");
    } catch (error) {
      console.error("❌ Error al actualizar cantidad:", error);
      alert("No se pudo actualizar la cantidad en el carrito.");
    }
  }





}
