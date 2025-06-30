import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { USUARIOS_API_URL, ROLES_API_URL, PERMISOS_API_URL, USERROLES_API_URL, ROLEPERMS_API_URL, AUTH_API_URL } from '../../environments/api';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { iniciarTemporizadorDeExpiracion } from '../utils/jwt-utils'; // ajusta la ruta si es distinto





@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private http: HttpClient, private router: Router) { }


  // 🔐 Login de usuario
  async login(username: string, password: string): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const response: any = await firstValueFrom(
      this.http.post(`${AUTH_API_URL}/login`, { username, password }, { headers })
    );

    // ⚠️ Validación de tokens
    if (!response?.token || !response?.refreshToken) {
      const msg = response?.message || response?.error || '❌ Tokens no recibidos';
      throw new Error(msg);
    }

    // 💾 Guardar datos importantes
    // 💾 Guardar datos importantes
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('username', response.username);

    // ⏱️ Iniciar temporizador de expiración del refreshToken
    iniciarTemporizadorDeExpiracion(response.refreshToken, this.router); // ← esto

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
      const response = await fetch(`${AUTH_API_URL}/buscar-por-email?email=${encodedEmail}`);
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
      await firstValueFrom(this.http.post(`${AUTH_API_URL}/generate-otp`, { email }, { headers }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.error?.message || 'Error al generar OTP.' };
    }
  }

  // ⏱ Consultar tiempo restante del OTP
  async obtenerTiempoRestante(email: string): Promise<{ success: boolean; tiempoRestante?: number; message?: string }> {
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`${AUTH_API_URL}/otp-tiempo-restante?email=${encodedEmail}`);
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
      await firstValueFrom(this.http.post(`${AUTH_API_URL}/reenviar-otp`, { email }, { headers }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.error?.message || 'Error al reenviar OTP.' };
    }
  }

  // ✅ Verificar OTP
  async verificarOtp(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      await firstValueFrom(this.http.post(`${AUTH_API_URL}/verificar-otp`, { email, otp }, { headers }));
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
        this.http.post(`${AUTH_API_URL}/register`, userData, { headers })
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

      const roles = await firstValueFrom(this.http.get<any[]>(ROLES_API_URL, { headers }));

      // 👇 Orden descendente por fecha de creación
      return roles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  async eliminarRol(id: string): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:roles.delete',
      'Content-Type': 'application/json'
    });

    try {
      const response = await firstValueFrom(
        this.http.delete(`${ROLES_API_URL}/${id}`, {
          headers,
          responseType: 'text' // 👈 backend devuelve texto plano
        })
      );

      return { success: true, message: response || '✅ Rol eliminado correctamente' };
    } catch (error: any) {
      const msg = typeof error?.error === 'string'
        ? error.error
        : error?.error?.message || '❌ Error al eliminar el rol';
      return { success: false, message: msg };
    }
  }


  async actualizarRol(id: string, payload: { name: string; description: string }): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': 'usuarios:roles.update'
    });

    try {
      await firstValueFrom(this.http.put(`${ROLES_API_URL}/${id}`, payload, { headers }));
      return { success: true, message: '✅ Rol actualizado correctamente' };
    } catch (error: any) {
      const msg = typeof error?.error === 'string'
        ? error.error
        : error?.error?.message || '❌ Error al actualizar el rol';
      return { success: false, message: msg };
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

  async listarRolesDeUsuario(userId: string): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:userroles.get.id'
    });

    try {
      return await firstValueFrom(this.http.get<any[]>(`${USUARIOS_API_URL}/userroles/usuario/${userId}`, { headers }));
    } catch (error: any) {
      console.error('❌ Error al listar roles del usuario:', error);
      throw error;
    }
  }

  async asignarRolAUsuario(payload: { userId: string; roleId: string }): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': 'usuarios:userroles.create'
    });

    try {
      const response = await firstValueFrom(
        this.http.post(`${USERROLES_API_URL}`, payload, {
          headers,
          responseType: 'text' as 'json'
        })
      );
      return { message: response as string };
    } catch (error: any) {
      console.error('❌ Error al asignar rol:', error);
      throw error;
    }
  }



  async eliminarRolDeUsuario(payload: { userId: string; roleId: string }): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': 'usuarios:userroles.delete'
    });

    try {
      const response = await firstValueFrom(
        this.http.request('delete', `${USERROLES_API_URL}`, {
          body: payload,
          headers,
          responseType: 'text' as 'json'
        })
      );
      return { message: response as string };
    } catch (error: any) {
      console.error('❌ Error al eliminar rol:', error);
      throw error;
    }
  }


  async listarTodosRolesUsuarios(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:userroles.get'
    });

    try {
      const roles = await firstValueFrom(
        this.http.get<any[]>(`${USERROLES_API_URL}/listado`, { headers })
      );

      // 🔽 Ordena por fecha descendente
      return roles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Error al listar roles de usuarios:', error);
      return [];
    }
  }


  // 📋 Listar relaciones Rol - Permiso
  // 📋 Listar relaciones Rol - Permiso
  async listarRelacionesRolPermiso(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:rolespermisos.get'
    });

    try {
      const relaciones = await firstValueFrom(
        this.http.get<any[]>(`${ROLEPERMS_API_URL}`, { headers })
      );

      // 🔽 Ordena por fecha descendente
      return relaciones.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error: any) {
      console.error('❌ Error al listar roles-permisos:', error);
      return [];
    }
  }


  // ✅ Asignar permiso a rol
  async asignarPermisoARol(payload: { roleId: string; permissionId: string }): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': 'usuarios:rolespermisos.create'
    });

    try {
      const response = await firstValueFrom(
        this.http.post(`${ROLEPERMS_API_URL}`, payload, {
          headers,
          responseType: 'text' as 'json'
        })
      );
      return { message: response as string };
    } catch (error: any) {
      console.error('❌ Error al asignar permiso a rol:', error);
      throw error;
    }
  }

  // ❌ Eliminar permiso de rol
  async eliminarPermisoDeRol(payload: { roleId: string; permissionId: string }): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': 'usuarios:rolespermisos.delete'
    });

    try {
      const response = await firstValueFrom(
        this.http.request('delete', `${ROLEPERMS_API_URL}`, {
          headers,
          body: payload,
          responseType: 'text' as 'json'
        })
      );
      return { message: response as string };
    } catch (error: any) {
      console.error('❌ Error al eliminar permiso de rol:', error);
      throw error;
    }
  }

  async listarUsuariosTabla(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:usuarios.get'
    });

    return await firstValueFrom(this.http.get<any[]>(`${USUARIOS_API_URL}/listado-simple`, { headers }));
  }


  // 🔹 Obtener detalles de un usuario por ID
  async obtenerUsuarioPorId(id: string): Promise<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:usuarios.get.id'
    });

    return await firstValueFrom(this.http.get<any>(`${USUARIOS_API_URL}/${id}`, { headers }));
  }

  async eliminarUsuario(id: string): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Permissions': 'usuarios:usuarios.delete'
    });

    try {
      const response = await firstValueFrom(
        this.http.delete(`${USUARIOS_API_URL}/${id}`, {
          headers,
          responseType: 'text' // ⚠️ si devuelves un String plano
        })
      );

      return { success: true, message: response || '✅ Usuario eliminado correctamente' };
    } catch (error: any) {
      const msg = typeof error?.error === 'string'
        ? error.error
        : error?.error?.message || '❌ Error al eliminar el usuario';
      return { success: false, message: msg };
    }
  }

  async actualizarUsuario(id: string, payload: any): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': 'usuarios:usuarios.update'
    });

    try {
      await firstValueFrom(this.http.put(`${USUARIOS_API_URL}/${id}`, payload, { headers }));
      return { success: true, message: '✅ Usuario actualizado correctamente' };
    } catch (error: any) {
      const msg = error?.error || '❌ Error al actualizar el usuario';
      return { success: false, message: msg };
    }
  }



  async cambiarPassword(id: string, nuevaPassword: string): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    const permisos = localStorage.getItem('permisos') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Permissions': permisos
    });

    try {
      await firstValueFrom(this.http.put(`${USUARIOS_API_URL}/${id}/cambiar-password-bypass`, {
        nuevaPassword
      }, { headers }));

      return { success: true, message: '✅ Contraseña actualizada correctamente' };
    } catch (error: any) {
      const msg = error?.error || '❌ Error al cambiar la contraseña';
      return { success: false, message: msg };
    }
  }




















}
