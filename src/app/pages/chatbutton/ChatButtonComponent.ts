// src/app/components/chat-button/chat-button.component.ts
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button class="chat-button" (click)="irAlChat()">
      💬 Chat
    </button>
  `,
  styles: [`
    .chat-button {
      padding: 8px 16px;
      border-radius: 12px;
      background-color: #222;
      color: white;
      border: none;
      cursor: pointer;
    }
    .chat-button:hover {
      background-color: #444;
    }
  `]
})
export class ChatButtonComponent {
  constructor(private router: Router) {}

  irAlChat() {
    this.router.navigate(['/chat']); // 👈 cambia según tu ruta
  }
}
