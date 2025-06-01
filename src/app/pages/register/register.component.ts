import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  email: string = '';
  error: string = '';
  success: string = '';

  form: any = {
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    profilePhotoUrl: ''
  };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const verificado = localStorage.getItem('otpVerificado');
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    // 🔐 Solo permite acceso si hay verificación Y email válido
    if (verificado !== 'true' || !this.email) {
      this.router.navigate(['/login']);
      return;
    }

    // 🔁 Limpia si se recarga o cierra
    window.addEventListener('beforeunload', this.limpiarStorage);
  }

  ngOnDestroy(): void {
    this.limpiarStorage();
    window.removeEventListener('beforeunload', this.limpiarStorage);
  }

  limpiarStorage = (): void => {
    localStorage.removeItem('otpVerificado');
    localStorage.removeItem('pasoPorEmail');
    localStorage.removeItem('pendingEmail');
  };

  async handleRegister() {
    this.error = '';
    this.success = '';

    if (
      !this.form.username || !this.form.password || !this.form.confirmPassword ||
      !this.form.firstName || !this.form.lastName ||
      !this.form.birthDay || !this.form.birthMonth || !this.form.birthYear ||
      !this.form.profilePhotoUrl
    ) {
      this.error = '❌ Todos los campos son obligatorios.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.error = '❌ Las contraseñas no coinciden.';
      return;
    }

    const birthdate = `${this.form.birthYear}-${this.form.birthMonth}-${this.form.birthDay}`;

    const datos = {
      email: this.email,
      username: this.form.username,
      password: this.form.password,
      confirmPassword: this.form.confirmPassword,
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      birthdate,
      profilePhotoUrl: this.form.profilePhotoUrl
    };

    const result = await this.usuariosService.register(datos);

    if (result.success) {
      this.success = '✅ Registro exitoso. Ahora puedes iniciar sesión.';
      this.limpiarStorage();
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.error = result.message || '❌ Error al registrar.';
    }
  }
}
