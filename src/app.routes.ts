import { Routes } from '@angular/router';
import { LoginComponent } from './app/pages/login/login.component';
import { HomeComponent } from './app/pages/home/home.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { EmailComponent } from './app/pages/email/email.component';
import { OtpComponent } from './app/pages/otp/otp.component';
import { PerfilComponent } from './app/pages/perfil/perfil.component';
import { AdminPanelComponent } from './app/pages/admin-panel/admin-panel.component'; // ✅ agregado
import { permissionGuard } from './app/pages/guard/permission.guard'; // path ajustado según dónde lo generaste


export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'email', component: EmailComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'yo', component: PerfilComponent },

  {
  path: 'adminpanel',
  component: AdminPanelComponent,
  canActivate: [permissionGuard],
  data: { permisos: ['ver:admin'] } // ✅ ahora acepta varios
},



  { path: '**', redirectTo: 'home' }
];
