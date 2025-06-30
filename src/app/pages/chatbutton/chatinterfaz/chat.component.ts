// src/app/pages/chat/chat.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true, // ✅ Muy importante
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  mensajes = [
    { senderId: '123', content: 'Hola', timestamp: new Date() },
    { senderId: 'yo', content: 'Hola! ¿Qué tal?', timestamp: new Date() }
  ];
  userId = 'yo';
  nuevoMensaje = '';

  enviarMensaje() {
    if (this.nuevoMensaje.trim()) {
      this.mensajes.push({
        senderId: this.userId,
        content: this.nuevoMensaje,
        timestamp: new Date()
      });
      this.nuevoMensaje = '';
    }
  }
}
