import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-perfil.component.html',
  styleUrls: ['./button-perfil.component.css']
})
export class ButtonPerfilComponent implements OnInit {
  permisos: string[] = [];
  isLoggedIn = false;
  opcionesVisibles: any[] = [];
  mostrarMenu = false;

  private timeoutId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const permisosRaw = localStorage.getItem('permisos');
    const token = localStorage.getItem('token');

    this.permisos = permisosRaw ? JSON.parse(permisosRaw) : [];
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      const opcionesFiltradas = [
        ...this.opcionesGenerales.filter(op => this.permisos.includes(op.permiso)),
        ...this.opcionesAdmin.filter(op => this.permisos.includes(op.permiso)),
      ];

      this.opcionesVisibles = opcionesFiltradas.length > 0
        ? [...opcionesFiltradas, this.opcionCerrarSesion]
        : [];
    } else {
      this.opcionesVisibles = this.opcionesSinPermisos;
    }
  }

  mostrar(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.mostrarMenu = true;
  }

  ocultar(): void {
    this.timeoutId = setTimeout(() => {
      this.mostrarMenu = false;
    }, 100);
  }

  handleOpcion(opcion: any): void {
    if (opcion.ruta === 'logout') {
      this.logout();
    } else {
      this.router.navigate([opcion.ruta]);
    }
    this.mostrarMenu = false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('permisos');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  opcionesGenerales = [
    { permiso: 'perfil:ver', titulo: 'Ver Perfil', ruta: '/user-profile' },
    { permiso: 'pedidos:ver', titulo: 'Mis Pedidos', ruta: '/orders' },
    { permiso: 'carrito:ver', titulo: 'Ver Carrito', ruta: '/cart' },
  ];

  opcionesAdmin = [
    { permiso: 'ver:admin', titulo: 'Panel Administrativo', ruta: '/adminpanel' },
    { permiso: 'ver:admin.permisos', titulo: 'Gestionar Permisos', ruta: '/manage-users' },
    { permiso: 'ver:admin.productos', titulo: 'Gestionar Productos', ruta: '/manage-products' },
    { permiso: 'ver:reportes', titulo: 'Ver Reportes', ruta: '/reports' },
  ];

  opcionCerrarSesion = { titulo: 'Cerrar sesión', ruta: 'logout' };

  opcionesSinPermisos = [
    { titulo: 'Explorar Productos', ruta: '/home/inicio' },
    { titulo: 'Iniciar sesión', ruta: '/login' },
    { titulo: 'Registrarse', ruta: '/register' },
    { titulo: 'Ayuda', ruta: '/help' },
  ];
}
