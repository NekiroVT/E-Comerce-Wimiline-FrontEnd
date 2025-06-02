import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent implements OnInit {
  @Output() opcionSeleccionada = new EventEmitter<string>();

  permisos: string[] = [];
  username: string = '';
  rol: string = '';
  fotoPerfil: string = 'assets/default-user.png';
  opcionesVisibles: any[] = [];

  ngOnInit(): void {
    const permisosRaw = localStorage.getItem('permisos');
    this.permisos = permisosRaw ? JSON.parse(permisosRaw) : [];

    this.username = localStorage.getItem('username') || 'Desconocido';

    const rolRaw = localStorage.getItem('rol');
    this.rol = rolRaw && rolRaw.trim() !== '' ? rolRaw : 'NO ROLE';

    const visiblesVendedor = this.opcionesVendedor.filter(op =>
      !op.permiso || this.permisos.includes(op.permiso)
    );

    const visiblesAdmin = this.opcionesAdmin.filter(op =>
      !op.permiso || this.permisos.includes(op.permiso)
    );

    const combinadas = [...visiblesVendedor, ...visiblesAdmin];
    this.opcionesVisibles = combinadas.length > 0 ? combinadas : [];
  }

  opcionesVendedor = [
    { icono: '🏠', titulo: 'Home', ruta: '/vendedor/home', permiso: 'panel-vendedor:home' },
    { icono: '📦', titulo: 'Administrar Productos', ruta: '/vendedor/productos', permiso: 'panel-vendedor:productos' },
    { icono: '📄', titulo: 'Comprobantes de pago', ruta: '/vendedor/comprobantes', permiso: 'panel-vendedor:comprobantes' },
    { icono: '📊', titulo: 'Estadísticas', ruta: '/vendedor/estadisticas', permiso: 'panel-vendedor:estadisticas' },
    { icono: '⭐', titulo: 'Reseñas y valoraciones', ruta: '/vendedor/resenas', permiso: 'panel-vendedor:resenas' },
    { icono: '✉️', titulo: 'Bandeja de mensajes', ruta: '/vendedor/mensajes', permiso: 'panel-vendedor:mensajes' },
    { icono: '💰', titulo: 'Historial de pagos', ruta: '/vendedor/pagos', permiso: 'panel-vendedor:pagos' },
    { icono: '📈', titulo: 'Balance', ruta: '/vendedor/balance', permiso: 'panel-vendedor:balance' }
  ];

  opcionesAdmin = [
    { icono: '🏠', titulo: 'Home', ruta: '/admin/home', permiso: 'panel-admin:home' },
    { icono: '👥', titulo: 'Gestión de Usuarios', ruta: '/admin/usuarios', permiso: 'panel-admin:usuarios' },
    { icono: '🛡️', titulo: 'Gestión de Roles', ruta: '/admin/roles', permiso: 'panel-admin:roles' },
    { icono: '🔐', titulo: 'Gestión de Permisos', ruta: 'permisos', permiso: 'panel-admin:permisos' }
,
    { icono: '🔄', titulo: 'Gestión de RolePerm', ruta: '/admin/roleperm', permiso: 'panel-admin:roleperm' },
    { icono: '🔗', titulo: 'Gestión de UserRol', ruta: '/admin/userrol', permiso: 'panel-admin:userrol' },
    { icono: '📦', titulo: 'Gestión de Productos', ruta: '/admin/productos', permiso: 'panel-admin:productos' },
    { icono: '📁', titulo: 'Gestión de Categorías', ruta: '/admin/categorias', permiso: 'panel-admin:categorias' }
  ];

  navegar(ruta: string): void {
    this.opcionSeleccionada.emit(ruta); // Emite la ruta al componente padre
  }
}
