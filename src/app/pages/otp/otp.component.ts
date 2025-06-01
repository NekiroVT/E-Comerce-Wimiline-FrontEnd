import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit, OnDestroy {
  email = '';
  otp = '';
  error = '';
  timer = 60;
  canResend = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    const yaVerificado = localStorage.getItem('otpVerificado');
    const lastRoute = sessionStorage.getItem('lastVisitedRoute');

    // 🔥 Si el usuario retrocede desde /register, mándalo al login
    if (yaVerificado === 'true' && lastRoute === '/register') {
      this.router.navigate(['/login']);
      return;
    }

    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    const savedEmail = localStorage.getItem('pendingEmail');

    if (!this.email || savedEmail !== this.email) {
      this.router.navigate(['/login']); // camibar a /email o donde quieras pero des despues de register hacia atras
      return;
    }

    this.cargarTiempoRestante();
    this.startTimer();
  }



  ngOnDestroy(): void {
    // Si el usuario se fue sin verificar, borra pasoPorEmail
    if (localStorage.getItem('pasoPorEmail') !== 'verificado') {
      localStorage.removeItem('pasoPorEmail');
    }
  }

  async cargarTiempoRestante() {
    const result = await this.usuariosService.obtenerTiempoRestante(this.email);
    if (result.success) {
      this.timer = typeof result.tiempoRestante === 'number' ? result.tiempoRestante : 60;
    } else {
      this.error = result.message || 'Error al obtener tiempo restante.';
      this.router.navigate(['/email']);
    }
  }

  startTimer() {
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.canResend = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  async handleVerifyOtp() {
    if (this.otp.length !== 4) {
      this.error = '❌ El código debe tener 4 dígitos.';
      return;
    }

    const result = await this.usuariosService.verificarOtp(this.email, this.otp);
    if (result.success) {
      localStorage.setItem('otpVerificado', 'true');
      localStorage.setItem('pasoPorEmail', 'true');
      localStorage.removeItem('pendingEmail'); // ✅ BORRA el correo una vez verificado

      this.router.navigate(['/register'], {
  queryParams: { email: this.email } // ✅ Manda el email por la URL
});

    } else {
      this.error = result.message || '❌ Código incorrecto o expirado.';
    }
  }






  async handleResendOtp() {
    if (!this.canResend) return;

    const result = await this.usuariosService.reenviarOtp(this.email);
    if (result.success) {
      const nuevoTiempo = await this.usuariosService.obtenerTiempoRestante(this.email);
      if (nuevoTiempo.success) {
        this.timer = typeof nuevoTiempo.tiempoRestante === 'number' ? nuevoTiempo.tiempoRestante : 60;
        this.canResend = false;
        this.startTimer();
        this.error = '✅ Nuevo código enviado.';
      }
    } else {
      this.error = '❌ No se pudo reenviar el código.';
    }
  }
}
