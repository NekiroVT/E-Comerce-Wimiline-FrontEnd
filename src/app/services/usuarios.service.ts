import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { USUARIOS_API_URL, ROLES_API_URL, PERMISOS_API_URL } from '../../environments/api';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private http: HttpClient) { }

  // 🔐 Login de usuario
  async login(username: string, password: string): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const response: any = await firstValueFrom(
      this.http.post(`${USUARIOS_API_URL}/login`, { username, password }, { headers })
    );

    if (!response?.token) {
      const msg = response?.message || response?.error || 'Token no recibido';
      throw new Error(msg);
    }

    localStorage.setItem('token', response.token);

    if (response.permisos) {
      localStorage.setItem('permisos', JSON.stringify(response.permisos));
      console.log('✅ Permisos guardados:', response.permisos);
    }

    return response;
  }

  // 🔍 Obtener usuario por email
  async getUsuarioPorEmail(email: string): Promise<any | null> {
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`${USUARIOS_API_URL}/buscar-por-email?email=${encodedEmail}`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error('❌ Error al buscar usuario por email:', error);
      return null;
    }
  }

  // 📩 Enviar OTP al correo
  async enviarOtp(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      await firstValueFrom(this.http.post(`${USUARIOS_API_URL}/generate-otp`, { email }, { headers }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.error?.message || 'Error al generar OTP.' };
    }
  }

  // ⏱ Consultar tiempo restante del OTP
  async obtenerTiempoRestante(email: string): Promise<{ success: boolean; tiempoRestante?: number; message?: string }> {
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`${USUARIOS_API_URL}/otp-tiempo-restante?email=${encodedEmail}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || 'Error al consultar tiempo restante.');

      return { success: true, tiempoRestante: data.tiempoRestante || 0 };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // 🔁 Reenviar OTP al correo
  async reenviarOtp(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      await firstValueFrom(this.http.post(`${USUARIOS_API_URL}/reenviar-otp`, { email }, { headers }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.error?.message || 'Error al reenviar OTP.' };
    }
  }

  // ✅ Verificar OTP
  async verificarOtp(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      await firstValueFrom(this.http.post(`${USUARIOS_API_URL}/verificar-otp`, { email, otp }, { headers }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.error?.message || 'Error al verificar OTP.' };
    }
  }

  // 📝 Registrar un nuevo usuario
  async register(userData: any): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response: any = await firstValueFrom(
        this.http.post(`${USUARIOS_API_URL}/register`, userData, { headers })
      );
      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, message: error?.error?.message || 'Error al registrar' };
    }
  }

  async listarUsuarios(): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'X-User-Permissions': 'usuarios:usuarios.get'
      });

      return await firstValueFrom(this.http.get<any[]>(USUARIOS_API_URL, { headers }));
    } catch (error: any) {
      console.error('❌ Error al listar usuarios:', error);
      return [];
    }
  }

  // 📋 Roles
  async listarRoles(): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'X-User-Permissions': 'usuarios:roles.get'
      });
      return await firstValueFrom(this.http.get<any[]>(ROLES_API_URL, { headers }));
    } catch (error) {
      console.error('❌ Error al listar roles:', error);
      return [];
    }
  }

  async crearRol(payload: { name: string; description: string }): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:roles.create'
    });

    try {
      await firstValueFrom(this.http.post(ROLES_API_URL, payload, { headers }));
      return { success: true, message: '✅ Rol creado correctamente' };
    } catch (error: any) {
      const mensaje = error?.error || '❌ Error al crear el rol';
      return { success: false, message: mensaje };
    }
  }

  async eliminarRol(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'X-User-Permissions': 'usuarios:roles.delete'
      });

      await firstValueFrom(this.http.delete(`${ROLES_API_URL}/${id}`, { headers }));
    } catch (error) {
      console.error('❌ Error al eliminar rol:', error);
      throw error;
    }
  }

  async actualizarRol(id: string, name: string, description = ''): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-User-Permissions': 'usuarios:roles.update'
      });

      const body = { name, description };
      return await firstValueFrom(this.http.put(`${ROLES_API_URL}/${id}`, body, { headers }));
    } catch (error) {
      console.error('❌ Error al actualizar rol:', error);
      throw error;
    }
  }

  // 📜 Permisos
  async listarPermisos(): Promise<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'X-User-Permissions': 'usuarios:permisos.get'
  });

  try {
    const permisos = await firstValueFrom(this.http.get<any[]>(PERMISOS_API_URL, { headers }));
    // Ordena por fecha descendente
    return permisos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('❌ Error al listar permisos:', error);
    return [];
  }
}


  async crearPermiso(payload: { name: string; description: string }): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:permisos.create'
    });



    try {
      await firstValueFrom(this.http.post(PERMISOS_API_URL, payload, { headers }));
      return { success: true, message: '✅ Permiso creado correctamente' };
    } catch (error: any) {
      const mensaje = error?.error || '❌ Error al crear el permiso';
      return { success: false, message: mensaje };
    }
  }

  async actualizarPermiso(id: string, permiso: { name: string; description: string }): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-User-Permissions': 'usuarios:permisos.update'
  });

  try {
    await firstValueFrom(
      this.http.put(`${PERMISOS_API_URL}/${id}`, permiso, { headers })
    );
    return { success: true, message: '✅ Permiso actualizado correctamente' };
  } catch (error: any) {
    const msg = error?.error || '❌ Error al actualizar el permiso';
    return { success: false, message: msg };
  }
}

async eliminarPermiso(id: string): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-User-Permissions': 'usuarios:permisos.delete'
  });

  try {
    const response = await firstValueFrom(
      this.http.delete(`${PERMISOS_API_URL}/${id}`, {
        headers,
        responseType: 'text' // 👈 Esto es CLAVE
      })
    );

    return { success: true, message: response || '✅ Permiso eliminado correctamente' };
  } catch (error: any) {
    console.error('❌ Error al eliminar permiso:', error);
    const msg = typeof error?.error === 'string'
      ? error.error
      : error?.error?.message || '❌ Error al eliminar el permiso';
    return { success: false, message: msg };
  }
}




}
