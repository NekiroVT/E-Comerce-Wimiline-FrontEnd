import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule) // ✅ ESTA LÍNEA AGREGA EL PROVEEDOR
  ]
});
