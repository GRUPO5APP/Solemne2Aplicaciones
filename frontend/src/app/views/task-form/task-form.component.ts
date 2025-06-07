import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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

export class TaskFormComponent implements OnChanges{
  @Input() taskToEdit: Task | null = null;
  @Output() formSubmit = new EventEmitter<Task>();

  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    dueDate: new Date()
  };

  editMode = false;
  editingTaskId: number | null = null;

  constructor(public taskService: TaskService) {}

ngOnChanges() {
  if (this.taskToEdit) {
    this.task = { ...this.taskToEdit };
    this.editingTaskId = this.taskToEdit.id!;
    this.editMode = true;
  } else {
    this.task = {
      title: '',
      description: '',
      status: 'Pendiente',
      priority: 'Media',
      dueDate: new Date()
    };
    this.editMode = false;
    this.editingTaskId = null;
  }
}


  onSubmit() {
    if (this.editMode && this.editingTaskId !== null) {
      const updatedTask: Task = {
        ...(this.task as Task),
        id: this.editingTaskId,
        dueDate: new Date(this.task.dueDate!),
        createdAt: this.task.createdAt || new Date(),
        status: this.task.status as 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso',
        priority: this.task.priority as 'Alta' | 'Media' | 'Baja'
      };
      this.formSubmit.emit(updatedTask);
    } else {
      const newTask: Task = {
        ...(this.task as Task),
        id: Date.now(),
        createdAt: new Date(),
        dueDate: new Date(this.task.dueDate!),
        status: this.task.status as 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso',
        priority: this.task.priority as 'Alta' | 'Media' | 'Baja'        
      };
      this.taskService.addTask(newTask);
      alert('Tarea agregada exitosamente.');
      this.formSubmit.emit();
    }

    this.task = {
      title: '',
      description: '',
      status: 'Pendiente',
      priority: 'Media',
      dueDate: new Date()
    };
    this.editMode = false;
    this.editingTaskId = null;
  }
}
