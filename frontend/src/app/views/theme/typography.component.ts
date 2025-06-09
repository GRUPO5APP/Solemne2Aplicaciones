import { Component } from '@angular/core';
import { TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';

@Component({
    templateUrl: 'typography.component.html',
    imports: [
        TextColorDirective,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        RouterLink
    ]
})
export class TypographyComponent {
  constructor() {}
}
