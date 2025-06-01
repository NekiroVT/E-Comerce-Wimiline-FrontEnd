import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() submit = new EventEmitter<void>();

  isSmallScreen = window.innerWidth <= 500;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth <= 500;
  }

  handleInput(event: any) {
    this.valueChange.emit(event.target.value);
  }

  handleSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submit.emit();
    }
  }
}
