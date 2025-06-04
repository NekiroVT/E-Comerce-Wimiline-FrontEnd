import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  email = '';
  loading = false;
  error = '';
  success = '';

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  const accesoAutorizado = localStorage.getItem('registroDesdeLogin');

  if (token) {
    this.router.navigate(['/home']); // Ya está logueado
    return;
  }

  if (accesoAutorizado !== 'activado') {
    this.router.navigate(['/login']); // 🚫 No vino del botón, lo echamos
    return;
  }

  // ✅ Deja pasar y luego elimina el flag (una sola vez)
  localStorage.removeItem('registroDesdeLogin');
}




  async handleEnviarCodigo() {
    this.error = '';
    this.success = '';

    if (!this.email || !this.email.includes('@')) {
      this.error = '❌ Correo inválido. Ingresa un correo válido.';
      return;
    }

    localStorage.removeItem('pendingEmail');
    localStorage.removeItem('otpVerificado');
    localStorage.removeItem('pasoPorEmail');

    this.loading = true;

    const result = await this.usuariosService.enviarOtp(this.email);

    if (result.success) {
      this.success = '✅ Código enviado. Revisa tu bandeja de entrada.';

      localStorage.setItem('pendingEmail', this.email);
      localStorage.setItem('pasoPorEmail', 'true');

      this.router.navigate(['/otp'], { queryParams: { email: this.email } });
    } else {
      this.error = result.message || '❌ Error al enviar OTP. Intenta nuevamente.';
    }

    this.loading = false;
  }
}
