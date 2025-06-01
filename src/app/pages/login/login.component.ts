import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  checkingLogin = true;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    } else {
      this.checkingLogin = false;
    }
  }

  async handleLogin() {
    this.error = '';
    try {
      const result = await this.usuariosService.login(this.username, this.password);
      if (result.token) {
        localStorage.setItem('token', result.token);
        this.router.navigate(['/home']);
      } else {
        this.error = result.message || '❌ Credenciales inválidas';
      }
    } catch (err: any) {
      this.error = err?.error?.message || err?.error?.error || '❌ Error de conexión o servidor.';
    }
  }

  handleCrearCuenta() {
    this.router.navigate(['/email']);
  }

  handleSeguirSinCuenta() {
    this.router.navigate(['/home']);

  }
}
