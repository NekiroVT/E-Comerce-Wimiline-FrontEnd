import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../pages/topbar/topbar.component';
import { TodoCarritoComponent } from '../../pages/todo-carrito/todo-carrito.component';
import { PagosComponent } from '../../pages/pagos/pagos.component'; // ajusta la ruta si es diferente


@Component({
  selector: 'app-vista-carrito',
  standalone: true,
  imports: [CommonModule, TopBarComponent, TodoCarritoComponent, PagosComponent],
  templateUrl: './vista-carrito.component.html',
  styleUrls: ['./vista-carrito.component.css']
})
export class VistaCarritoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
