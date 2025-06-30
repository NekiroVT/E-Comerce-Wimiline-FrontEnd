import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCTOS_API_URL } from '../../environments/api';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  constructor(private http: HttpClient) { }

  // 🛒 Crear nuevo producto


  // 📦 Obtener todos los productos (tarjetas)
  async getProductos(): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');

      const headers = token
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : new HttpHeaders();

      const response = await firstValueFrom(
        this.http.get<any>(`${PRODUCTOS_API_URL}/tarjetas`, { headers })
      );

      return response?.productos || []; // Extrae "productos" del wrapper
    } catch (error: any) {
      console.error('❌ Error al obtener productos:', error.message);
      return [];
    }
  }

  async getProductoPorId(id: string): Promise<any | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${PRODUCTOS_API_URL}/detalles/${id}`)
      );

      // Aquí puedes seleccionar la combinación principal o alguna lógica de selección
      const producto = response;  // El producto completo con combinaciones
      if (producto && producto.combinaciones) {
        // Selecciona la combinación correcta, aquí supongo que eliges la principal o alguna lógica similar
        const combinacionSeleccionada = producto.combinaciones.find((comb: any) => comb.esPrincipal);

        if (combinacionSeleccionada) {
          return {
            ...producto,
            stock: combinacionSeleccionada.stock,  // Agregar el stock de la combinación
            precio: combinacionSeleccionada.precio,
            imagen: combinacionSeleccionada.imagenes?.[0]?.urlImagen || null,
          };
        }
      }

      return null;  // Si no se encuentra la combinación
    } catch (error: any) {
      console.error('❌ Error al obtener detalle del producto:', error.message);
      return null;
    }
  }



}
