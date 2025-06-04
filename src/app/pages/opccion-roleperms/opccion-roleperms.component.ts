import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-opccion-roleperms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opccion-roleperms.component.html',
  styleUrls: ['./opccion-roleperms.component.css']
})
export class OpccionRolepermsComponent implements OnInit {
  relaciones: any[] = [];
  relacionesFiltradas: any[] = [];
  filtro: string = '';

  roles: any[] = [];
  permisos: any[] = [];

  nuevo = { roleId: '', permissionId: '' };
  mensaje: string = '';

  mostrarModal = false;
  mostrarModalEliminar = false;
  roleAEliminar: string = '';
  permisoAEliminar: string = '';
  mensajeEliminar: string = '';
  nombreRol: string = '';
  nombrePermiso: string = '';

  constructor(private usuariosService: UsuariosService) { }

  async ngOnInit() {
    await this.listarTodo();
  }

  async listarTodo() {
    try {
      const data = await this.usuariosService.listarRelacionesRolPermiso();
      this.relaciones = [...data];
      this.relacionesFiltradas = [...data];
      this.mensaje = data.length ? '' : '⚠️ No hay relaciones registradas.';
    } catch (error: any) {
      this.mensaje = '❌ Error al obtener datos: ' + error.message;
    }
  }

  filtrar() {
    const texto = this.filtro.toLowerCase();
    this.relacionesFiltradas = this.relaciones.filter(r =>
      r.roleName?.toLowerCase().includes(texto) || r.permissionName?.toLowerCase().includes(texto)
    );
  }

  async abrirModal() {
    this.nuevo = { roleId: '', permissionId: '' };
    this.mensaje = '';
    this.mostrarModal = true;

    try {
      this.roles = await this.usuariosService.listarRoles();
      this.permisos = await this.usuariosService.listarPermisos();
    } catch (error: any) {
      this.mensaje = '❌ Error al cargar roles o permisos: ' + error.message;
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async asignar() {
    this.mensaje = '';
    const { roleId, permissionId } = this.nuevo;

    if (!roleId || !permissionId) {
      this.mensaje = '⚠️ Debes seleccionar un rol y un permiso.';
      return;
    }

    try {
      await this.usuariosService.asignarPermisoARol({ roleId, permissionId });
      await this.listarTodo();
      this.cerrarModal();
    } catch (error: any) {
      this.mensaje = '❌ Error al asignar: ' + (error?.error || error?.message);
    }
  }

  abrirModalEliminar(roleId: string, permissionId: string, roleName: string, permissionName: string) {
    this.roleAEliminar = roleId;
    this.permisoAEliminar = permissionId;
    this.nombreRol = roleName;
    this.nombrePermiso = permissionName;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.roleAEliminar = '';
    this.permisoAEliminar = '';
    this.nombreRol = '';
    this.nombrePermiso = '';
    this.mensajeEliminar = '';
  }

  async confirmarEliminar() {
    this.mensajeEliminar = '';

    if (!this.roleAEliminar || !this.permisoAEliminar) return;

    try {
      await this.usuariosService.eliminarPermisoDeRol({
        roleId: this.roleAEliminar,
        permissionId: this.permisoAEliminar
      });

      await this.listarTodo();
      this.cerrarModalEliminar();
    } catch (error: any) {
      this.mensajeEliminar = '❌ Error al eliminar: ' + (error?.error || error?.message);
    }
  }

  
}
