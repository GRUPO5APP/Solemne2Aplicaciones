import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent
} from '@coreui/angular';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: 'typography.component.html',
  standalone: true,
  imports: [
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RouterLink
  ]
})
export class TypographyComponent {
  constructor(private router: Router) {}

  login(email: string, password: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Correo electrónico inválido');
      window.location.reload(); 
    }
  }
}