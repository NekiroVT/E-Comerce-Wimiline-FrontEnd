import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const permisosUsuario = JSON.parse(localStorage.getItem('permisos') || '[]');

  const permisosRequeridos: string[] = route.data['permisos'] || [];
  const tieneAlguno = token && permisosRequeridos.some(p => permisosUsuario.includes(p));

  console.log('✅ Guard revisando permisos:', permisosRequeridos, '→', tieneAlguno);

  if (tieneAlguno) {
    return true;
  } else {
    router.navigate(['/login']); // o /403 si querés
    return false;
  }
};
