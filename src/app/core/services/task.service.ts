import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskFilter, TaskFormData, TasksResponse } from '../../types';

/**
 * Task Service
 * Handles all task-related API operations using signals for reactive state
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  // Signal-based state management
  private readonly tasksSignal = signal<Task[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly tasks = this.tasksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Get all tasks with optional filtering
   */
  getTasks(filter?: TaskFilter): Observable<Task[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let params = new HttpParams();
    if (filter?.status && filter.status !== 'all') {
      params = params.set('status', filter.status);
    }
    if (filter?.priority && filter.priority !== 'all') {
      params = params.set('priority', filter.priority);
    }
    if (filter?.assigneeId && filter.assigneeId !== 'all') {
      params = params.set('assignee.id', filter.assigneeId);
    }

    return this.http.get<Task[]>(this.apiUrl, { params }).pipe(
      map((tasks) => {
        // Apply search filter if provided
        if (filter?.search) {
          const searchLower = filter.search.toLowerCase();
          return tasks.filter(
            (task) =>
              task.title.toLowerCase().includes(searchLower) ||
              task.description.toLowerCase().includes(searchLower)
          );
        }
        return tasks;
      }),
      tap({
        next: (tasks) => {
          this.tasksSignal.set(tasks);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      })
    );
  }

  /**
   * Get a single task by ID
   */
  getTaskById(id: string): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => this.loadingSignal.set(false),
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      })
    );
  }

  /**
   * Create a new task
   */
  createTask(taskData: TaskFormData): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const newTask: Partial<Task> = {
      ...taskData,
      id: `task-${Date.now()}`,
      assignee: this.getUserById(taskData.assigneeId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.http.post<Task>(this.apiUrl, newTask).pipe(
      tap({
        next: (task) => {
          this.tasksSignal.update((tasks) => [...tasks, task]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      })
    );
  }

  /**
   * Update an existing task
   */
  updateTask(id: string, taskData: Partial<TaskFormData>): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Extract assigneeId and remove it from the update data
    const { assigneeId, ...restTaskData } = taskData;

    // Remove undefined values to avoid issues with JSON Server
    const cleanTaskData = Object.fromEntries(
      Object.entries(restTaskData).filter(([_, value]) => value !== undefined)
    ) as Partial<TaskFormData>;

    const updateData: Partial<Task> = {
      ...cleanTaskData,
      updatedAt: new Date().toISOString(),
    };

    if (assigneeId) {
      updateData.assignee = this.getUserById(assigneeId);
    }

    console.log('Updating task:', id, updateData);

    // Ensure we're sending a proper PATCH request
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, updateData).pipe(
      tap({
        next: (updatedTask) => {
          console.log('Task updated successfully:', updatedTask);
          this.tasksSignal.update((tasks) =>
            tasks.map((task) => (task.id === id ? updatedTask : task))
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      })
    );
  }

  /**
   * Delete a task
   */
  deleteTask(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.tasksSignal.update((tasks) => tasks.filter((task) => task.id !== id));
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      })
    );
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: Task['status']): Observable<Task[]> {
    return this.getTasks({ status });
  }

  /**
   * Helper method to get user by ID (mock implementation)
   * In a real app, this would come from a user service
   */
  private getUserById(userId: string) {
    // Mock users - in real app, fetch from user service
    const users = [
      { id: 'user-001', name: 'John Doe', avatar: 'JD', email: 'john.doe@company.com' },
      { id: 'user-002', name: 'Sarah Smith', avatar: 'SS', email: 'sarah.smith@company.com' },
      { id: 'user-003', name: 'Mike Johnson', avatar: 'MJ', email: 'mike.johnson@company.com' },
      { id: 'user-004', name: 'Emily Davis', avatar: 'ED', email: 'emily.davis@company.com' },
    ];
    return users.find((u) => u.id === userId) || users[0];
  }
}

