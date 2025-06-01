import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  // CRUD variables
  nuevoRol = '';
  descripcionRol = '';
  nuevoPermiso = '';
  usuarioIdParaRol = '';
  rolParaAsignar = '';
  rolIdParaPermiso = '';
  permisoParaAsignar = '';
  descripcionPermiso = '';


  usuarios: any[] = [];
  roles: any[] = [];
  permisos: any[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarPermisos();
  }

  async cargarUsuarios(): Promise<void> {
    try {
      this.usuarios = await this.usuariosService.listarUsuarios();
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
    }
  }

  async cargarRoles(): Promise<void> {
    try {
      this.roles = await this.usuariosService.listarRoles();
    } catch (error) {
      console.error('❌ Error al cargar roles:', error);
    }
  }

  async cargarPermisos(): Promise<void> {
    try {
      this.permisos = await this.usuariosService.listarPermisos();
    } catch (error) {
      console.error('❌ Error al cargar permisos:', error);
    }
  }

  async crearRol(): Promise<void> {
    const nombre = this.nuevoRol.trim();
    const descripcion = this.descripcionRol.trim();
    if (!nombre || !descripcion) return;

    const payload = { name: nombre, description: descripcion };

    try {
      const result = await this.usuariosService.crearRol(payload);
      if (result.success) {
        console.log(result.message);
        this.nuevoRol = '';
        this.descripcionRol = '';
        await this.cargarRoles();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('❌ Error al crear rol:', error);
    }
  }

  async eliminarRol(id: string): Promise<void> {
    if (!confirm('¿Seguro que deseas eliminar este rol?')) return;

    try {
      await this.usuariosService.eliminarRol(id);
      await this.cargarRoles();
    } catch (error) {
      console.error('❌ Error al eliminar rol:', error);
    }
  }

  async crearPermiso(): Promise<void> {
  const nombre = this.nuevoPermiso.trim();
  const descripcion = this.descripcionPermiso.trim();
  if (!nombre || !descripcion) return;

  try {
    const result = await this.usuariosService.crearPermiso({ name: nombre, description: descripcion });
    if (result.success) {
      console.log(result.message);
      this.nuevoPermiso = '';
      this.descripcionPermiso = '';
      await this.cargarPermisos();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('❌ Error al crear permiso:', error);
  }
}


  asignarRolAUsuario(): void {
    console.log(`👤 Asignar Rol '${this.rolParaAsignar}' a Usuario ID ${this.usuarioIdParaRol}`);
    // TODO: Implementar asignarRolAUsuario()
  }

  asignarPermisoARol(): void {
    console.log(`🔗 Asignar Permiso '${this.permisoParaAsignar}' al Rol ${this.rolIdParaPermiso}`);
    // TODO: Implementar asignarPermisoARol()
  }
}
