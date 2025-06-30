import { Routes } from '@angular/router';
import { LoginComponent } from './app/pages/login/login.component';
import { HomeComponent } from './app/pages/home/home.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { EmailComponent } from './app/pages/email/email.component';
import { OtpComponent } from './app/pages/otp/otp.component';
import { permissionGuard } from './app/pages/guard/permission.guard'; // path ajustado según dónde lo generaste
import { ProductoVerComponent } from './app/pages/producto-ver/producto-ver.component';
import { PanelVendedorComponent } from './app/pages/panel-vendedor/panel-vendedor.component';
import { PanelAdminComponent } from './app/pages/panel-admin/panel-admin.component';
import { OpccionPermisosComponent } from './app/pages/opccion-permisos/opccion-permisos.component';
import { OpccionRolesComponent } from './app/pages/opccion-roles/opccion-roles.component';
import { OpccionUserrolesComponent } from './app/pages/opccion-userroles/opccion-userroles.component';
import { OpccionRolepermsComponent } from './app/pages/opccion-roleperms/opccion-roleperms.component';
import { OpccionUsuariosComponent } from './app/pages/opccion-usuarios/opccion-usuarios.component';
import { ChatComponent } from './app/pages/chatbutton/chatinterfaz/chat.component'; // Ajusta la ruta si está en otro lugar
import { VistaCarritoComponent } from './app/pages/vista-carrito/vista-carrito.component';  // Asegúrate de la ruta correcta
import { EnvioComponent } from './app/pages/envio/envio.component';






export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'email', component: EmailComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'selectproducto/:id', component: ProductoVerComponent },
  { path: 'chat', component: ChatComponent},
  { path: 'carrito', component: VistaCarritoComponent },
  {
  path: 'panel-vendedor',
  component: PanelVendedorComponent,
  canActivate: [permissionGuard],
  data: { permisos: ['ver:panel.vendedor'] },
  children: [

  ]
}
,

  {
    path: 'panel-admin',
    component: PanelAdminComponent,
    canActivate: [permissionGuard],
    data: { permisos: ['ver:panel.admin'] },
    children: [
      {
        path: 'permisos',
        component: OpccionPermisosComponent
      },
      {
        path: 'roles',
        component: OpccionRolesComponent // 👈 esta es la nueva ruta
      },
      {
        path: 'userroles',
        component: OpccionUserrolesComponent // 👈 esta es la nueva ruta
      },
      {
        path: 'roleperms',
        component: OpccionRolepermsComponent // 👈 esta es la nueva ruta
      },
      {
        path: 'usuarios',
        component: OpccionUsuariosComponent // 👈 esta es la nueva ruta
      }
    ]
  }

  ,



  { path: '**', redirectTo: 'home' }
];
