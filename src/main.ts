import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app.routes';
import { TokenInterceptor } from './app/interceptors/token.interceptor'; // ✅ Asegúrate que esté bien la ruta

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([TokenInterceptor])) // ✅ AÑADIR ESTO
  ]
});
