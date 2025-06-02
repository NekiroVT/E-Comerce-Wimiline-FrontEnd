import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-opccion-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opccion-permisos.component.html',
  styleUrls: ['./opccion-permisos.component.css']
})
export class OpccionPermisosComponent implements OnInit {
  permisos: any[] = [];
  permisosFiltrados: any[] = [];
  filtro: string = '';

  mostrarModal = false;
  nuevoPermiso = { name: '', description: '' };
  mensaje: string = '';

  constructor(private usuariosService: UsuariosService) { }

  async ngOnInit() {
    await this.cargarPermisos();
  }

  async cargarPermisos() {
    this.permisos = await this.usuariosService.listarPermisos();
    this.permisosFiltrados = this.permisos;
  }

  filtrarPermisos() {
    const texto = this.filtro.toLowerCase();
    this.permisosFiltrados = this.permisos.filter(p =>
      p.name.toLowerCase().includes(texto) || p.description.toLowerCase().includes(texto)
    );
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevoPermiso = { name: '', description: '' };
    this.mensaje = '';
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async crearPermiso() {
    if (!this.nuevoPermiso.name.trim()) {
      this.mensaje = '⚠️ El nombre del permiso es obligatorio.';
      return;
    }

    const resultado = await this.usuariosService.crearPermiso(this.nuevoPermiso);
    this.mensaje = resultado.message;

    if (resultado.success) {
      this.cerrarModal();
      await this.cargarPermisos();
    }
  }

  // Modal de edición
  mostrarModalEditar = false;
  permisoEditado: any = { id: '', name: '', description: '' };
  mensajeEditar = '';

  abrirModalEditar(permiso: any) {
    this.permisoEditado = { ...permiso }; // copia profunda
    this.mensajeEditar = '';
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
  }

  async guardarCambios() {
    const { id, name, description } = this.permisoEditado;

    if (!name.trim()) {
      this.mensajeEditar = '⚠️ El nombre del permiso es obligatorio.';
      return;
    }

    const permisoOriginal = this.permisos.find(p => p.id === id);
    if (permisoOriginal.name === name && permisoOriginal.description === description) {
      this.mensajeEditar = '⚠️ Estás intentando guardar el mismo contenido';
      return;
    }

    const resultado = await this.usuariosService.actualizarPermiso(id, { name, description });
    this.mensajeEditar = resultado.message;

    if (resultado.success) {
      // elimina directamente de la lista local
      this.permisos = this.permisos.filter(p => p.id !== this.permisoAEliminar.id);
      this.permisosFiltrados = this.permisos.filter(p =>
        p.name.toLowerCase().includes(this.filtro.toLowerCase()) ||
        p.description.toLowerCase().includes(this.filtro.toLowerCase())
      );
      this.cerrarModalEliminar();
    }

  }

  mostrarModalEliminar = false;
permisoAEliminar: any = null;
mensajeEliminar = '';

abrirModalEliminar(permiso: any) {
  this.permisoAEliminar = permiso;
  this.mensajeEliminar = '';
  this.mostrarModalEliminar = true;
}

cerrarModalEliminar() {
  this.mostrarModalEliminar = false;
  this.permisoAEliminar = null;
  this.mensajeEliminar = '';
}


async confirmarEliminar() {
  if (!this.permisoAEliminar) return;

  const resultado = await this.usuariosService.eliminarPermiso(this.permisoAEliminar.id);
  this.mensajeEliminar = resultado.message;

  if (resultado.success) {
    // ✅ Elimina correctamente de ambas listas
    this.permisos = this.permisos.filter(p => p.id !== this.permisoAEliminar.id);
    this.permisosFiltrados = this.permisosFiltrados.filter(p => p.id !== this.permisoAEliminar.id);

    this.cerrarModalEliminar(); // cierra y resetea todo
  }
}






}
