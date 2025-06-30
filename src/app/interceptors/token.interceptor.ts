import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { AUTH_API_URL } from '../../environments/api';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  const isLoginOrRefresh = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
  if (isLoginOrRefresh) return next(req);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        // 🛠️ Llamar al endpoint de refresh
        return http.post<any>(`${AUTH_API_URL}/refresh`, { refreshToken }).pipe(
          switchMap((data) => {
            const nuevoToken = data.accessToken;
            const nuevoRefreshToken = data.refreshToken;

            if (!nuevoToken || !nuevoRefreshToken) {
              throw new Error('No se recibió nuevo token o refresh');
            }

            // 💾 Guardar ambos tokens en localStorage
            localStorage.setItem('token', nuevoToken);
            localStorage.setItem('refreshToken', nuevoRefreshToken);

            // 🔁 Reintentar la petición original con el nuevo token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${nuevoToken}` }
            });

            return next(retryReq);
          }),
          catchError(() => {
  // ❌ Si falla también el refresh → limpiar solo las claves específicas
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  localStorage.removeItem('permisos');

  router.navigateByUrl('/login').then(() => location.reload());
  return throwError(() => error);
})
        );
      }

      if (error.status === 403) {
        alert('🚫 No tienes permiso para esta acción');
      }

      return throwError(() => error);
    })
  );
};
