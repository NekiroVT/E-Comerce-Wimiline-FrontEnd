import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductosService } from '../../services/productos.service';
import { ProductoCardComponent } from '../../pages/producto-card/producto-card.component';
import { BuscadorComponent } from '../../pages/buscador/buscador.component';
import { NavbarComponent } from '../../pages/navbar/navbar.component'; // ✅ Importado
import { ButtonPerfilComponent } from '../../pages/button-perfil/button-perfil.component';
import { CarritoComponent } from '../../pages/carrito/carrito.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductoCardComponent, BuscadorComponent, ButtonPerfilComponent, NavbarComponent, CarritoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productos: any[] = [];
  filtrados: any[] = [];
  permisos: string[] = [];
  searchQuery = '';
  isLoggedIn = false;
  loading = true;
  numColumns = 2;
  cardWidth = 200;

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.init();
    this.updateColumnCount(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateColumnCount(event.target.innerWidth);
  }

  async init() {
    this.loading = true;

    this.isLoggedIn = !!localStorage.getItem('token');
    const permisosStr = localStorage.getItem('permisos');
    this.permisos = permisosStr ? JSON.parse(permisosStr) : [];

    try {
      this.productos = await this.productosService.getProductos();
      this.filtrados = this.productos;
    } catch (err) {
      console.error('Error cargando productos:', err);
    }

    this.loading = false;
  }

  updateColumnCount(width: number) {
    if (width < 500) this.numColumns = 2;
    else if (width < 750) this.numColumns = 2;
    else if (width < 900) this.numColumns = 3;
    else if (width < 1100) this.numColumns = 4;
    else this.numColumns = 5;

    const padding = 48;
    const spacing = this.numColumns * 16;
    this.cardWidth = (width - padding - spacing) / this.numColumns;
  }

  handleSearch() {
    const q = this.searchQuery.toLowerCase();
    this.filtrados = this.productos.filter(p => p.nombre.toLowerCase().includes(q));
  }

  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('permisos');
    this.isLoggedIn = false;
    this.filtrados = [];
  }
}
