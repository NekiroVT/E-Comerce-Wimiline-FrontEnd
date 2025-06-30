import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import { CARRITO_API_URL, STOCK_API_URL } from '../../environments/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carritoActualizado = new Subject<void>(); // 🔔 Subject
  carritoActualizado$ = this.carritoActualizado.asObservable();

  constructor(private http: HttpClient) { }

  // 🔔 Método para notificar que el carrito cambió
  notificarCambioCarrito() {
    this.carritoActualizado.next();
  }

   private seleccionadosSubject = new BehaviorSubject<any[]>([]);
  seleccionados$ = this.seleccionadosSubject.asObservable();

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
    this.notificarCambioCarrito(); // 🔔 Notificar cambio
  }

  // ✅ Obtener carrito simple (para validaciones rápidas)
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

  // ✅ Carrito completo con todos los datos necesarios para visualizar
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

  // ✅ Actualizar cantidad
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
    this.notificarCambioCarrito(); // 🔔 Notificar cambio
  }

  // ✅ Listar items poco detallados (para navbar/carrito rápido)
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
        throw new Error(response.message || 'Error al obtener los items del carrito');
      }
    } catch (error: any) {
      console.error("❌ Error al obtener los items del carrito:", error.message);
      return [];
    }
  }

  // ✅ Obtener stock de una combinación
  async obtenerStockCombinacion(combinacionId: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${STOCK_API_URL}/stock/${combinacionId}`)
      );
      return response || 0;
    } catch (error: any) {
      console.error("❌ Error al obtener el stock de la combinación:", error.message);
      return 0;
    }
  }

  // ✅ Eliminar producto del carrito
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
      .then(() => this.notificarCambioCarrito()); // 🔔 Notificar eliminación
  }

    actualizarSeleccionados(items: any[]) {
    const seleccionados = items.filter(item => item.seleccionado);
    this.seleccionadosSubject.next(seleccionados);
  }
  

  
}
