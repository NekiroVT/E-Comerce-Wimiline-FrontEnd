import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DIRECCIONES_API_URL, LOGISTICA_API_URL } from '../../environments/api';

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
    return response;
  }

  // ✅ Calcular envío agrupado por sede logística
  async calcularEnvio(data: { 'producto-ids': string[], 'direccion-id': string }): Promise<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });

    const response = await firstValueFrom(
      this.http.post<any>(`${LOGISTICA_API_URL}/calcular-envio`, data, { headers })
    );

    console.log('✅ Respuesta calcularEnvio:', response);
    return response;
  }

}
