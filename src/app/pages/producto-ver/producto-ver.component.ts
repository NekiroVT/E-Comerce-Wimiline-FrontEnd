import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-ver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-ver.component.html',
  styleUrls: ['./producto-ver.component.css']
})
export class ProductoVerComponent implements OnInit {
  producto: any;
  imagenSeleccionada: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    let rawId = this.route.snapshot.paramMap.get('id')!;
    const id = rawId.replace('.html', '');

    // (Simulación) Buscar producto por ID
    this.producto = {
      id,
      nombre: 'Producto de ejemplo',
      precio: 12.99,
      descripcion: 'Descripción completa del producto de ejemplo.',
      valoracion: 5,
      imagenes: [
        { urlImagen: '../../../assets/Nekoe.jpg' },
        { urlImagen: '../../../assets/Nekoe.jpg' },
        { urlImagen: '../../../assets/Nekoe.jpg' }
      ],
      variaciones: ['Rojo', 'Verde'],
      especificaciones: [
        { clave: 'Material', valor: 'Algodón' },
        { clave: 'Tamaño', valor: 'M' }
      ]
    };

    this.imagenSeleccionada = this.producto.imagenes[0].urlImagen;

    // Puedes leer los parámetros extra si quieres
    const spm = this.route.snapshot.queryParamMap.get('spm');
    const pvid = this.route.snapshot.queryParamMap.get('pvid');
    const ref = this.route.snapshot.queryParamMap.get('ref');

    console.log({ id, spm, pvid, ref });
  }

  getVariaciones(): string {
    return this.producto.variaciones?.join(', ') || '';
  }
}
