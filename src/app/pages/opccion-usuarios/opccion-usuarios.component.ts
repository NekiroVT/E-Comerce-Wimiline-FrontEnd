import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-opccion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opccion-usuarios.component.html',
  styleUrls: ['./opccion-usuarios.component.css']
})
export class OpccionUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtro: string = '';

  // Modales
  mostrarModalDetalles = false;
  mostrarModalEliminar = false;
  mostrarModalEditar = false;
  mostrarModalPassword = false;

  // Datos
  usuarioSeleccionado: any = null;
  usuarioAEliminar: any = null;

  // Mensajes
  mensajeEliminar = '';
  mensajePassword = '';
  mensajeEditar = '';

  // Formulario edición
  formulario: any = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    birthdate: '',
    profilePhotoUrl: '',
    status: 'active'
  };

  // Cambio de contraseña
  nuevaPassword: string = '';

  constructor(private usuariosService: UsuariosService) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = await this.usuariosService.listarUsuariosTabla();
    this.usuariosFiltrados = this.usuarios;
  }

  filtrarUsuarios() {
    const texto = this.filtro.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.username.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto)
    );
  }

  async verDetalles(usuario: any) {
    const res = await this.usuariosService.obtenerUsuarioPorId(usuario.id);
    this.usuarioSeleccionado = res;
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles() {
    this.mostrarModalDetalles = false;
    this.usuarioSeleccionado = null;
  }

  abrirModalEliminar(usuario: any) {
    this.usuarioAEliminar = usuario;
    this.mensajeEliminar = '';
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.usuarioAEliminar = null;
    this.mensajeEliminar = '';
  }

  async confirmarEliminar() {
    if (!this.usuarioAEliminar) return;

    const resultado = await this.usuariosService.eliminarUsuario(this.usuarioAEliminar.id);
    this.mensajeEliminar = typeof resultado.message === 'string'
  ? resultado.message
  : JSON.stringify(resultado.message);


    if (resultado.success) {
      this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar.id);
      this.usuariosFiltrados = this.usuariosFiltrados.filter(u => u.id !== this.usuarioAEliminar.id);
      this.cerrarModalEliminar();
    }
  }

  abrirModalEditar(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    this.formulario = {
      username: usuario.username,
      email: usuario.email,
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      birthdate: usuario.birthdate,
      profilePhotoUrl: usuario.profilePhotoUrl,
      status: usuario.status
    };
    this.mensajeEditar = '';
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.usuarioSeleccionado = null;
  }

  async guardarCambios() {
    const resultado = await this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id, this.formulario);
    this.mensajeEditar = resultado.message || '';

    if (resultado.success) {
      await this.cargarUsuarios();
      this.cerrarModalEditar();
    }
  }

  abrirModalPassword(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.nuevaPassword = '';
    this.mensajePassword = '';
    this.mostrarModalPassword = true;
  }

  cerrarModalPassword() {
    this.mostrarModalPassword = false;
    this.nuevaPassword = '';
    this.mensajePassword = '';
  }

  async confirmarCambioPassword() {
    const resultado = await this.usuariosService.cambiarPassword(this.usuarioSeleccionado.id, this.nuevaPassword);
    this.mensajePassword = resultado.message || '';

    if (resultado.success) {
      this.cerrarModalPassword();
    }
  }
}
