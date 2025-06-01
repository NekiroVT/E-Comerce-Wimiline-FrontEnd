import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `<h1 style="text-align:center">❌ Página no encontrada</h1>`,
})
export class NotFoundComponent {}
