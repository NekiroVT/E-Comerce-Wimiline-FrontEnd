import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { iniciarTemporizadorDeExpiracion } from './utils/jwt-utils'; // ruta ajusta si es necesario

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      iniciarTemporizadorDeExpiracion(refresh, this.router);
    }
  }
}
