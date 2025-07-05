import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/tasks/';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(taskData: Partial<Omit<Task, 'id' | 'createdAt'>>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  updateTask(id: number, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}${id}/`, taskData);
  }


  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  patchTask(id: number, partial: Partial<Omit<Task, 'id' | 'createdAt'>>): Observable<Task> {
  return this.http.patch<Task>(`${this.apiUrl}${id}/`, partial);
}

}
