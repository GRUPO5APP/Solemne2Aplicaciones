import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../../views/task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class TaskListComponent{
  @Output() edit = new EventEmitter<Task>();
  tasks: Task[] = [];

  filterStatus: string = '';
  filterPriority: string = '';
  searchTerm: string = '';

  editingTask: Task | null = null;

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.checkForExpiringTasks();
  }

  checkForExpiringTasks(): void {
    const now = new Date();

    const alertedTasks = JSON.parse(localStorage.getItem('alertedTasks') || '[]');

    this.tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const hoursLeft = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (
        hoursLeft > 0 &&
        hoursLeft <= 24 &&
        task.status !== 'Completada' &&
        !alertedTasks.includes(task.id)
      ) {
        alert(`⚠️ La tarea "${task.title}" vence en menos de 24 horas.`);

        alertedTasks.push(task.id);
    }
  });

  localStorage.setItem('alertedTasks', JSON.stringify(alertedTasks));
}
  

  get filteredTasks(): Task[] {
    return this.taskService.getTasks().filter(task =>
    (!this.filterStatus || task.status === this.filterStatus) &&
    (!this.filterPriority || task.priority === this.filterPriority) &&
    (!this.searchTerm ||
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
  );
  }

  onDelete(taskId: number) {
    this.taskService.deleteTask(taskId);
  }

  markAsCompleted(task: Task) {
  const updatedTask = { ...task, status: 'Completada' as 'Completada' | 'Pendiente' | 'Vencida' };
  this.taskService.updateTask(updatedTask);
  }

  markAsPending(task: Task) {
  const updatedTask: Task = {
    ...task,
    status: 'Pendiente' as 'Completada' | 'Pendiente' | 'Vencida'
  };
  this.taskService.updateTask(updatedTask);
  }
  
  getTimeRemaining(dueDate: Date): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Vencida';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let result = '';
  if (diffDays > 0) {
    result += `${diffDays}d `;
  }
  if (diffHours > 0) {
    result += `${diffHours}h `;
  }
  result += `${diffMinutes}m`;

  return result;
}

clearFilters() {
    this.filterStatus = '';
    this.filterPriority = '';
  }

  openEditModal(task: Task) {
  this.editingTask = { ...task }; 
}

onTaskSaved(updatedTask: Task) {
  this.taskService.updateTask(updatedTask);
  alert('✅ Tarea actualizada exitosamente.');
  this.editingTask = null;
}


cancelEdit() {
  this.editingTask = null;
}

}