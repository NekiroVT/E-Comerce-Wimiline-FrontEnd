import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCTOS_API_URL } from '../../environments/api';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductosService {
    constructor(private http: HttpClient) { }

    // 🛒 Crear nuevo producto
    async crearProducto(productoData: any): Promise<any> {
        try {
            const token = localStorage.getItem('token'); // reemplazo de AsyncStorage

            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            });

            const response = await firstValueFrom(
                this.http.post(PRODUCTOS_API_URL, productoData, { headers })
            );

            return response;
        } catch (error: any) {
            console.error('❌ Error al crear producto:', error.message);
            throw new Error('No se pudo crear el producto');
        }
    }

    // 📦 Obtener todos los productos
    async getProductos(): Promise<any[]> {
        try {
            const token = localStorage.getItem('token');

            const headers = token
                ? new HttpHeaders({ Authorization: `Bearer ${token}` })
                : new HttpHeaders();

            const response = await firstValueFrom(
                this.http.get<any[]>(PRODUCTOS_API_URL, { headers })
            );

            return response;
        } catch (error: any) {
            console.error('❌ Error al obtener productos:', error.message);
            return []; // En caso de error, retorna un array vacío
        }
    }

}
