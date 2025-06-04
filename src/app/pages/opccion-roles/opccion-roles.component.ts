import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-opccion-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opccion-roles.component.html',
  styleUrls: ['./opccion-roles.component.css']
})
export class OpccionRolesComponent implements OnInit {
  roles: any[] = [];
  rolesFiltrados: any[] = [];
  filtro: string = '';

  mostrarModal = false;
  nuevoRol = { name: '', description: '' };
  mensaje: string = '';

  mostrarModalEditar = false;
  rolEditado: any = { id: '', name: '', description: '' };
  mensajeEditar = '';

  mostrarModalEliminar = false;
  rolAEliminar: any = null;
  mensajeEliminar = '';

  constructor(private usuariosService: UsuariosService) {}

  async ngOnInit() {
    await this.cargarRoles();
  }

  async cargarRoles() {
    this.roles = await this.usuariosService.listarRoles();
    this.rolesFiltrados = this.roles;
  }

  filtrarRoles() {
    const texto = this.filtro.toLowerCase();
    this.rolesFiltrados = this.roles.filter(r =>
      r.name.toLowerCase().includes(texto) || r.description.toLowerCase().includes(texto)
    );
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevoRol = { name: '', description: '' };
    this.mensaje = '';
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async crearRol() {
    if (!this.nuevoRol.name.trim()) {
      this.mensaje = '⚠️ El nombre del rol es obligatorio.';
      return;
    }

    const resultado = await this.usuariosService.crearRol(this.nuevoRol);
    this.mensaje = resultado.message;

    if (resultado.success) {
      this.cerrarModal();
      await this.cargarRoles();
    }
  }

  abrirModalEditar(rol: any) {
    this.rolEditado = { ...rol };
    this.mensajeEditar = '';
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
  }

  async guardarCambios() {
    const { id, name, description } = this.rolEditado;

    if (!name.trim()) {
      this.mensajeEditar = '⚠️ El nombre del rol es obligatorio.';
      return;
    }

    const rolOriginal = this.roles.find(r => r.id === id);
    if (rolOriginal.name === name && rolOriginal.description === description) {
      this.mensajeEditar = '⚠️ Estás intentando guardar el mismo contenido';
      return;
    }

    const resultado = await this.usuariosService.actualizarRol(id, { name, description });
    this.mensajeEditar = resultado.message;

    if (resultado.success) {
      this.cerrarModalEditar();
      await this.cargarRoles();
    }
  }

  abrirModalEliminar(rol: any) {
    this.rolAEliminar = rol;
    this.mensajeEliminar = '';
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.rolAEliminar = null;
    this.mensajeEliminar = '';
  }

  async confirmarEliminar() {
    if (!this.rolAEliminar) return;

    const resultado = await this.usuariosService.eliminarRol(this.rolAEliminar.id);
    this.mensajeEliminar = resultado.message;

    if (resultado.success) {
      this.roles = this.roles.filter(r => r.id !== this.rolAEliminar.id);
      this.rolesFiltrados = this.rolesFiltrados.filter(r => r.id !== this.rolAEliminar.id);
      this.cerrarModalEliminar();
    }
  }
}
