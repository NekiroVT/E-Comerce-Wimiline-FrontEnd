import { Router } from '@angular/router';

// 🧠 Decodifica el token y obtiene el tiempo de expiración
export function getTokenExpirationTime(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // lo pasamos a milisegundos
  } catch {
    return null;
  }
}

// ⏱️ Inicia un temporizador que imprime cada segundo y cierra sesión al expirar
export function iniciarTemporizadorDeExpiracion(refreshToken: string, router: Router) {
  const refreshExp = getTokenExpirationTime(refreshToken);
  if (refreshExp) {
    const tiempoRestante = refreshExp - Date.now();
    if (tiempoRestante > 0) {
      const interval = setInterval(() => {
        const ahora = Date.now();
        const restante = Math.max(0, refreshExp - ahora);
        const segundos = Math.floor(restante / 1000);

        console.log(`⏳ Tiempo restante para que expire el refreshToken: ${segundos}s`);

        if (restante <= 0) {
          clearInterval(interval);
          console.warn('🔒 El refreshToken ha expirado. Cerrando sesión...');
         localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  localStorage.removeItem('permisos');
          router.navigateByUrl('/login').then(() => location.reload());
        }
      }, 1000);
    }
  }
}
