import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../../views/task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  filterStatus = '';
  filterPriority = '';
  searchTerm = '';

  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.checkForExpiringTasks();
    });
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
    return this.tasks.filter(task =>
      (!this.filterStatus || task.status === this.filterStatus) &&
      (!this.filterPriority || task.priority === this.filterPriority) &&
      (!this.searchTerm ||
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onDelete(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
    });
  }

  markAsCompleted(task: Task) {
    const updatedTask: Task = { ...task, status: 'Completada' };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  markAsPending(task: Task) {
    const updatedTask: Task = { ...task, status: 'Pendiente' };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  getTimeRemaining(dueDate: Date | string): string {
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
    this.searchTerm = '';
  }

  openEditModal(task: Task) {
    this.editingTask = { ...task };
  }

  onTaskSaved(updatedTask: Task) {
    if (updatedTask.id) {
      this.taskService.updateTask(updatedTask).subscribe(() => {
        this.loadTasks();
        alert('✅ Tarea actualizada exitosamente.');
      });
    } else {
      this.taskService.addTask(updatedTask).subscribe(() => {
        this.loadTasks();
        alert('✅ Tarea creada exitosamente.');
      });
    }
    this.editingTask = null;
  }

  cancelEdit() {
    this.editingTask = null;
  }
}
