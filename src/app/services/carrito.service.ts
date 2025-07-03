import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subject, BehaviorSubject } from 'rxjs';
import { CARRITO_API_URL, STOCK_API_URL } from '../../environments/api';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private carritoActualizado = new Subject<void>();
  carritoActualizado$ = this.carritoActualizado.asObservable();

  private seleccionadosSubject = new BehaviorSubject<any[]>([]);
  seleccionados$ = this.seleccionadosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔔 Notificar que el carrito cambió
  notificarCambioCarrito() {
    this.carritoActualizado.next();
  }

  // ✅ Agregar al carrito
  async agregarAlCarrito(combinacionId: string, cantidad: number): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });

    const payload = { combinacionId, cantidad };

    const response = await firstValueFrom(
      this.http.post<any>(`${CARRITO_API_URL}/agregar`, payload, { headers })
    );

    if (!response.success) {
      throw new Error(response.message || 'Error desconocido');
    }

    console.log("✅ Backend:", response.message);
    this.notificarCambioCarrito();
  }

  // ✅ Obtener carrito simple
  async obtenerCarrito(): Promise<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    try {
      const carrito = await firstValueFrom(
        this.http.get<any>(`${CARRITO_API_URL}/obtener`, { headers })
      );
      return carrito;
    } catch (error: any) {
      console.error("❌ Error al obtener carrito:", error.message);
      return { items: [] };
    }
  }

  // ✅ Carrito completo
  async obtenerCarritoCompleto(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${CARRITO_API_URL}/listar-completo`, { headers })
      );

      if (response.success) {
        return response.items;
      } else {
        throw new Error(response.message || 'Error al obtener carrito completo');
      }
    } catch (error: any) {
      console.error('❌ Error al obtener carrito completo', error.message);
      return [];
    }
  }

  // ✅ Actualizar cantidad de un item
  async actualizarCantidad(combinacionId: string, cantidad: number): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });

    const payload = { combinacionId, cantidad };

    const response = await firstValueFrom(
      this.http.put<any>(`${CARRITO_API_URL}/actualizar-cantidad`, payload, { headers })
    );

    if (!response.success) {
      throw new Error(response.message || 'Error actualizando cantidad');
    }

    console.log("✅ Cantidad actualizada:", response.message);
    this.notificarCambioCarrito();
  }

  // ✅ Navbar / carrito rápido
  async listarPocoCarrito(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${CARRITO_API_URL}/listar-poco`, { headers })
      );
      if (response.success) {
        return response.items;
      } else {
        throw new Error(response.message || 'Error al obtener items del carrito');
      }
    } catch (error: any) {
      console.error("❌ Error al obtener items del carrito:", error.message);
      return [];
    }
  }

  // ✅ Stock real de una combinación
  async obtenerStockCombinacion(combinacionId: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${STOCK_API_URL}/stock/${combinacionId}`)
      );
      return response || 0;
    } catch (error: any) {
      console.error("❌ Error al obtener stock de combinación:", error.message);
      return 0;
    }
  }

  // ✅ Eliminar item del carrito
  eliminarProducto(combinacionId: string, usuarioId: string): Promise<void> {
    const body = { combinacionId, usuarioId };
    const token = localStorage.getItem('token');

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http
      .request<void>('delete', `${CARRITO_API_URL}/eliminar/${combinacionId}`, {
        body,
        headers
      })
      .toPromise()
      .then(() => this.notificarCambioCarrito());
  }

  // ✅ Actualizar lista de seleccionados
  actualizarSeleccionados(items: any[]) {
    const seleccionados = items.filter(item => item.seleccionado);
    this.seleccionadosSubject.next(seleccionados);
  }

  // ✅ Getter limpio para los seleccionados actuales
  getSeleccionados(): any[] {
    return this.seleccionadosSubject.getValue();
  }
}
