import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskFilter, TaskFormData } from '../../types';

/**
 * Task Service
 *
 * Central service for managing task-related operations including CRUD operations,
 * filtering, and state management using Angular signals for reactive updates.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private taskService = inject(TaskService);
 *
 * // Get all tasks
 * this.taskService.getTasks().subscribe(tasks => console.log(tasks));
 *
 * // Get filtered tasks
 * this.taskService.getTasks({ status: 'todo', priority: 'high' }).subscribe();
 *
 * // Access reactive state
 * const tasks = this.taskService.tasks(); // Signal
 * const isLoading = this.taskService.loading(); // Signal
 * ```
 *
 * @see {@link Task} for task data structure
 * @see {@link TaskFilter} for filter options
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

  /**
   * Readonly signal containing all tasks.
   * Updates automatically when tasks are fetched, created, updated, or deleted.
   */
  readonly tasks = this.tasksSignal.asReadonly();

  /**
   * Readonly signal indicating if a task operation is in progress.
   * True during API calls, false otherwise.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal containing error messages from failed operations.
   * Null when no errors occur.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Get all tasks with optional filtering
   *
   * Fetches tasks from the API and applies client-side filtering if provided.
   * Search filtering is performed on the client side for better UX.
   *
   * @param filter - Optional filter object containing status, priority, assigneeId, and search query
   * @returns Observable that emits an array of tasks matching the filter criteria
   *
   * @example
   * ```typescript
   * // Get all tasks
   * this.taskService.getTasks().subscribe();
   *
   * // Get tasks with filters
   * this.taskService.getTasks({
   *   status: 'todo',
   *   priority: 'high',
   *   search: 'important'
   * }).subscribe();
   * ```
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
              task.description.toLowerCase().includes(searchLower),
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
      }),
    );
  }

  /**
   * Get a single task by ID
   *
   * Fetches a specific task from the API by its unique identifier.
   *
   * @param id - The unique identifier of the task
   * @returns Observable that emits the task with the specified ID
   * @throws Error if task is not found or API call fails
   *
   * @example
   * ```typescript
   * this.taskService.getTaskById('task-001').subscribe(task => {
   *   console.log('Task:', task);
   * });
   * ```
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
      }),
    );
  }

  /**
   * Create a new task
   *
   * Creates a new task with the provided data. Automatically generates
   * a unique ID and sets creation/update timestamps.
   *
   * @param taskData - The task data to create (without id, timestamps)
   * @returns Observable that emits the created task with all fields populated
   *
   * @example
   * ```typescript
   * this.taskService.createTask({
   *   title: 'New Task',
   *   description: 'Task description',
   *   status: 'todo',
   *   priority: 'high',
   *   dueDate: '2025-12-31',
   *   assigneeId: 'user-001',
   *   tags: ['urgent']
   * }).subscribe(task => {
   *   console.log('Created:', task);
   * });
   * ```
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
      }),
    );
  }

  /**
   * Update an existing task
   *
   * Updates a task with partial data. Only provided fields will be updated.
   * Automatically updates the `updatedAt` timestamp. Handles assignee
   * conversion from assigneeId to assignee object.
   *
   * @param id - The unique identifier of the task to update
   * @param taskData - Partial task data containing only fields to update
   * @returns Observable that emits the updated task
   *
   * @example
   * ```typescript
   * // Update task status
   * this.taskService.updateTask('task-001', { status: 'done' }).subscribe();
   *
   * // Update multiple fields
   * this.taskService.updateTask('task-001', {
   *   priority: 'high',
   *   assigneeId: 'user-002'
   * }).subscribe();
   * ```
   */
  updateTask(id: string, taskData: Partial<TaskFormData>): Observable<Task> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Extract assigneeId and remove it from the update data
    const { assigneeId, ...restTaskData } = taskData;

    // Remove undefined values to avoid issues with JSON Server
    const cleanTaskData = Object.fromEntries(
      Object.entries(restTaskData).filter(([_, value]) => value !== undefined),
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
            tasks.map((task) => (task.id === id ? updatedTask : task)),
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      }),
    );
  }

  /**
   * Delete a task
   *
   * Permanently removes a task from the system. The task is removed
   * from the local state immediately upon successful deletion.
   *
   * @param id - The unique identifier of the task to delete
   * @returns Observable that completes when deletion is successful
   *
   * @example
   * ```typescript
   * this.taskService.deleteTask('task-001').subscribe({
   *   next: () => console.log('Task deleted'),
   *   error: (err) => console.error('Delete failed:', err)
   * });
   * ```
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
      }),
    );
  }

  /**
   * Get tasks by status
   *
   * Convenience method to fetch tasks filtered by a specific status.
   *
   * @param status - The task status to filter by ('todo' | 'in_progress' | 'done')
   * @returns Observable that emits an array of tasks with the specified status
   *
   * @example
   * ```typescript
   * this.taskService.getTasksByStatus('todo').subscribe(tasks => {
   *   console.log('To-do tasks:', tasks);
   * });
   * ```
   */
  getTasksByStatus(status: Task['status']): Observable<Task[]> {
    return this.getTasks({ status });
  }

  /**
   * Helper method to get user by ID (mock implementation)
   *
   * Returns a user object based on the provided user ID. This is a mock
   * implementation that uses a hardcoded list of users. In a production
   * application, this should be replaced with a call to a UserService.
   *
   * @param userId - The unique identifier of the user
   * @returns User object if found, otherwise returns the first user as fallback
   *
   * @private
   * @todo Replace with UserService integration in production
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
