import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() formSubmit = new EventEmitter<Task>();

  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    dueDate: this.getCurrentLocalDateTime()
  };

  editMode = false;
  editingTaskId: number | null = null;

  constructor(private taskService: TaskService) {}

  ngOnChanges() {
    if (this.taskToEdit) {
      this.task = {
        ...this.taskToEdit,
        dueDate: this.toLocalInputFormat(this.taskToEdit.dueDate)
      };
      this.editingTaskId = this.taskToEdit.id!;
      this.editMode = true;
    } else {
      this.resetForm();
    }
  }

  private getCurrentLocalDateTime(): string {
  const now = new Date();
  now.setSeconds(0, 0);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

private toLocalInputFormat(dateStr: string): string {
  const date = new Date(dateStr);
  date.setSeconds(0, 0);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

  isFutureDate(date: string): boolean {
    return new Date(date) > new Date();
  }

  isDueSoon(date: string): boolean {
    const now = new Date();
    const due = new Date(date);
    const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursLeft > 0 && hoursLeft <= 24;
  }

  onSubmit(form: any) {
    if (!this.isFutureDate(this.task.dueDate!)) {
      alert('⚠️ La fecha de vencimiento debe ser posterior al momento actual.');
      return;
    }

    const payload = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: new Date(this.task.dueDate!).toISOString()
    };

    if (this.editMode && this.editingTaskId !== null) {
      this.taskService.updateTask(this.editingTaskId, payload).subscribe({
        next: (updatedTask) => {
          alert('✅ Tarea actualizada exitosamente.');
          if (this.isDueSoon(payload.dueDate)) {
            alert(`⚠️ La tarea "${this.task.title}" vence en menos de 24 horas.`);
          }
          this.formSubmit.emit(updatedTask);
          this.resetForm(form);
        },
        error: (err) => {
          console.error('Error al actualizar tarea:', err);
          alert('❌ No se pudo actualizar la tarea.');
        }
      });
    } else {
      this.taskService.addTask(payload).subscribe({
        next: (createdTask) => {
          alert('✅ Tarea creada exitosamente.');
          if (this.isDueSoon(payload.dueDate)) {
            alert(`⚠️ La tarea "${this.task.title}" vence en menos de 24 horas.`);
          }
          this.formSubmit.emit(createdTask);
          this.resetForm(form);
        },
        error: (err) => {
          console.error('Error al crear tarea:', err);
          alert('❌ No se pudo agregar la tarea.');
        }
      });
    }
  }

  private resetForm(form?: any) {
    this.task = {
      title: '',
      description: '',
      status: 'Pendiente',
      priority: 'Media',
      dueDate: this.getCurrentLocalDateTime()
    };
    this.editMode = false;
    this.editingTaskId = null;

    if (form) {
      form.resetForm(this.task);
    }
  }
}
