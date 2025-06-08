import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Administración de tareas'
  },
  {
    name: 'Crear tarea',
    url: '/task-form/create-task',
    iconComponent: { name: 'cil-note-add' },
  },
  {
    name: 'Reporte de Tareas',
    url: '/report',
    iconComponent: { name: 'cil-chart-pie' }
  },

];
