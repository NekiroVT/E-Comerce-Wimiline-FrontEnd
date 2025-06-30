import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CATEGORIAS_API_URL } from '../../environments/api'; // Asegúrate que esto apunte a: /api/categorias/listar
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  constructor(private http: HttpClient) {}

  async getCategorias(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${CATEGORIAS_API_URL}/listar`)
      );
      return response;
    } catch (error: any) {
      console.error('❌ Error al obtener categorías:', error.message);
      return [];
    }
  }
}
