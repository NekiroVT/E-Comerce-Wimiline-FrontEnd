import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../pages/navbar/navbar.component';// Ajustá el path si cambia


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  permisos: string[] = [];
  isLoggedIn = false;
  hoveredButton: string | null = null;
  opcionesVisibles: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const permisosRaw = localStorage.getItem('permisos');
    const token = localStorage.getItem('token');

    this.permisos = permisosRaw ? JSON.parse(permisosRaw) : [];
    this.isLoggedIn = !!token;

    this.opcionesVisibles = this.isLoggedIn
      ? [...this.opcionesGenerales, ...this.opcionesAdmin]
      : this.opcionesSinPermisos;
  }

  tienePermiso(permiso: string): boolean {
    return this.permisos.includes(permiso);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('permisos');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  navigate(ruta: string): void {
    this.router.navigate([ruta]);
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

  opcionesSinPermisos = [
    { titulo: 'Explorar Productos', ruta: '/home/inicio' },
    { titulo: 'Iniciar sesión', ruta: '/login' },
    { titulo: 'Registrarse', ruta: '/register' },
    { titulo: 'Ayuda', ruta: '/help' },
  ];
}
