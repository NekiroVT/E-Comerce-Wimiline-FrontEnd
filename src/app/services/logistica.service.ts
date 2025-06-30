import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DIRECCIONES_API_URL } from '../../environments/api'; // ✅ Ojo: usa la URL correcta

@Injectable({ providedIn: 'root' })
export class LogisticaService {

  constructor(private http: HttpClient) {}

  // ✅ Guardar nueva dirección de entrega
  async guardarDireccion(data: any): Promise<void> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });

    const response = await firstValueFrom(
      this.http.post<any>(`${DIRECCIONES_API_URL}`, data, { headers })
    );

    console.log('✅ Respuesta guardarDireccion:', response);

    // Si tu backend devuelve algo como { success: true }, valida si quieres:
    // if (!response.success) {
    //   throw new Error(response.message || 'Error al guardar dirección.');
    // }
    // Si solo devuelve 200 OK → listo.
  }

  // ✅ Listar direcciones del usuario
  async listarDirecciones(): Promise<any[]> {
    const token = localStorage.getItem('token');

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    const response = await firstValueFrom(
      this.http.get<any>(`${DIRECCIONES_API_URL}`, { headers })
    );

    console.log('✅ Respuesta listarDirecciones:', response);

    // Si backend devuelve lista pura:
    return response;

    // Si backend devuelve { success: true, items: [] }:
    // return response.items;
  }

}
