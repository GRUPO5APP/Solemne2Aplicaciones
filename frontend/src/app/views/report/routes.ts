import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reporte'
    },
    children: [
      {
        path: '',
        redirectTo: 'report',
        pathMatch: 'full'
      },
      {
        path: 'report',
        loadComponent: () => import('./report.component').then(m => m.ReportComponent),
        data: {
          title: 'Reporte de Tareas'
        }
      }
    ]
  }
];

