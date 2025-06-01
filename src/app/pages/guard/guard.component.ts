import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const permisos = localStorage.getItem('permisos');

  const tienePermisoAdmin = permisos && JSON.parse(permisos).includes('ver:admin');

  if (token && tienePermisoAdmin) {
    return true;
  } else {
    router.navigate(['/login']); // o a una página 403 personalizada
    return false;
  }
};
