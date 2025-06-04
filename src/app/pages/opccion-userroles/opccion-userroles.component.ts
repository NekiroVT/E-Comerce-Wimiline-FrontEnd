import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-opccion-userroles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opccion-userroles.component.html',
  styleUrls: ['./opccion-userroles.component.css']
})
export class OpccionUserrolesComponent implements OnInit {
  userRoles: any[] = [];
  userRolesFiltrados: any[] = [];
  filtro: string = '';

  usuarios: any[] = [];
  roles: any[] = [];

  nuevoRol = { userId: '', roleId: '' };
  mensaje: string = '';

  mostrarModal = false;
  mostrarModalEliminar = false;
  rolAEliminar: string = '';
  userAEliminar: string = '';
  mensajeEliminar: string = '';

  constructor(private usuariosService: UsuariosService) { }

  async ngOnInit() {
    await this.listarTodosLosRoles();
  }

  async listarTodosLosRoles() {
    try {
      const roles = await this.usuariosService.listarTodosRolesUsuarios();
      this.userRoles = [...roles];
      this.userRolesFiltrados = [...roles];
      this.mensaje = roles.length ? '' : '⚠️ No se encontraron roles.';
    } catch (error: any) {
      this.mensaje = '❌ Error al obtener roles: ' + error.message;
    }
  }

  filtrarRoles() {
    const texto = this.filtro.toLowerCase();
    this.userRolesFiltrados = this.userRoles.filter(r =>
      r.username.toLowerCase().includes(texto) || r.roleName.toLowerCase().includes(texto)
    );
  }

  async abrirModal() {
    this.nuevoRol = { userId: '', roleId: '' };
    this.mensaje = '';
    this.mostrarModal = true;

    try {
      this.usuarios = await this.usuariosService.listarUsuarios();
      this.roles = await this.usuariosService.listarRoles(); // ✅ nombre actualizado
    } catch (error: any) {
      this.mensaje = '❌ Error al cargar usuarios o roles: ' + error.message;
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async asignarRol() {
  this.mensaje = ''; // 🧼 Limpiar mensaje anterior

  const { userId, roleId } = this.nuevoRol;

  if (!userId || !roleId) {
    this.mensaje = '⚠️ Debes seleccionar un usuario y un rol.';
    return;
  }

  try {
    const resultado = await this.usuariosService.asignarRolAUsuario({
      userId,
      roleId
    });


    await this.listarTodosLosRoles();
    this.cerrarModal(); // 👈 Esto también limpiará mensaje
  } catch (error: any) {
    this.mensaje = '❌ Error al asignar rol: ' + (error?.error || error?.message);
  }
}


nombreUsuario: string = '';
nombreRol: string = '';


  abrirModalEliminar(userId: string, roleId: string, username: string, roleName: string) {
  this.userAEliminar = userId;
  this.rolAEliminar = roleId;
  this.nombreUsuario = username;
  this.nombreRol = roleName;
  this.mostrarModalEliminar = true;
}



  cerrarModalEliminar() {
  this.mostrarModalEliminar = false;
  this.userAEliminar = '';
  this.rolAEliminar = '';
  this.nombreUsuario = '';
  this.nombreRol = '';
  this.mensajeEliminar = ''; // ✅ Limpieza visual del mensaje
}


  async confirmarEliminar() {
  this.mensajeEliminar = ''; // 🧼 Limpiar mensaje anterior

  if (!this.userAEliminar.trim() || !this.rolAEliminar) return;

  try {
    await this.usuariosService.eliminarRolDeUsuario({
      userId: this.userAEliminar.trim(),
      roleId: this.rolAEliminar
    });

    await this.listarTodosLosRoles();
    this.cerrarModalEliminar(); // ❌ No hay mensaje si todo salió bien
  } catch (error: any) {
    this.mensajeEliminar = '⚠️ ❌ Error al eliminar rol: ' + (error?.error || error?.message);
  }
}



}
