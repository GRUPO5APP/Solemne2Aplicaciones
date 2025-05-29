import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tareas'
    },
    children: [
      {
        path: '',
        redirectTo: 'create-task',
        pathMatch: 'full'
      },
      {
        path: 'create-task',
        loadComponent: () => import('./task-form.component').then(m => m.TaskFormComponent),
        data: {
          title: 'Crear tarea'
        }
      }
    ]
  }
];

