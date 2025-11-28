import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService, UserService, SearchService } from '../../core/services';
import { Task, TaskStatus, TaskPriority, TaskFilter } from '../../types';
import { TaskFiltersComponent } from './task-filters/task-filters.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

/**
 * Tasks Component (Smart/Container)
 *
 * Main tasks page component that displays tasks in a Kanban board layout.
 * Handles task filtering, search, drag-and-drop operations, and task CRUD
 * operations through dialogs.
 *
 * Features:
 * - Kanban board with three columns (To Do, In Progress, Done)
 * - Task filtering by status and priority
 * - Global search integration
 * - Drag-and-drop to change task status
 * - Create, edit, and delete tasks via dialogs
 *
 * @example
 * ```typescript
 * // Component automatically loads tasks on init
 * // Filters are reactive and update automatically
 *
 * // Access filtered tasks
 * const tasks = this.filteredTasks(); // Signal
 *
 * // Access tasks by status
 * const todoTasks = this.todoTasks(); // Signal
 * ```
 *
 * @see {@link TaskFiltersComponent} for filter UI
 * @see {@link TaskBoardComponent} for Kanban board
 * @see {@link TaskFormComponent} for task creation/editing
 */
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    TaskFiltersComponent,
    TaskBoardComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private searchService = inject(SearchService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  /**
   * Current status filter value
   * Can be 'all', 'todo', 'in_progress', or 'done'
   */
  readonly statusFilter = signal<TaskStatus | 'all'>('all');

  /**
   * Current priority filter value
   * Can be 'all', 'low', 'medium', or 'high'
   */
  readonly priorityFilter = signal<TaskPriority | 'all'>('all');

  /**
   * Current search query from global search service
   */
  readonly searchQuery = this.searchService.searchQuery;

  /**
   * All tasks from the task service
   * Updates reactively when tasks are fetched, created, updated, or deleted
   */
  readonly allTasks = this.taskService.tasks;

  /**
   * Loading state from the task service
   * True when task operations are in progress
   */
  readonly loading = this.taskService.loading;

  /**
   * Computed signal of filtered tasks
   * Automatically updates when filters or search query changes
   * Applies status, priority, and search filters
   */
  readonly filteredTasks = computed(() => {
    let tasks = this.allTasks();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const search = this.searchQuery().toLowerCase();

    if (status !== 'all') {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (priority !== 'all') {
      tasks = tasks.filter((task) => task.priority === priority);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search),
      );
    }

    return tasks;
  });

  /**
   * Tasks filtered to 'todo' status
   * Computed from filteredTasks for Kanban column display
   */
  readonly todoTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === 'todo'),
  );

  /**
   * Tasks filtered to 'in_progress' status
   * Computed from filteredTasks for Kanban column display
   */
  readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === 'in_progress'),
  );

  /**
   * Tasks filtered to 'done' status
   * Computed from filteredTasks for Kanban column display
   */
  readonly doneTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === 'done'),
  );

  /**
   * Component initialization
   * Loads tasks when the component is initialized
   */
  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Load tasks from the API with current filters
   *
   * Fetches tasks from the task service using the current filter state
   * (status, priority, and search query). Updates the component after
   * the operation completes.
   */
  loadTasks(): void {
    const filter: TaskFilter = {
      status: this.statusFilter(),
      priority: this.priorityFilter(),
      search: this.searchQuery(),
    };
    this.taskService.getTasks(filter).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Handle status filter change
   *
   * Updates the status filter and reloads tasks with the new filter.
   *
   * @param status - The new status filter value
   */
  onStatusFilterChange(status: TaskStatus | 'all'): void {
    this.statusFilter.set(status);
    this.loadTasks();
  }

  /**
   * Handle priority filter change
   *
   * Updates the priority filter and reloads tasks with the new filter.
   *
   * @param priority - The new priority filter value
   */
  onPriorityFilterChange(priority: TaskPriority | 'all'): void {
    this.priorityFilter.set(priority);
    this.loadTasks();
  }

  /**
   * Handle search query change
   *
   * Updates the global search query and reloads tasks with the new search.
   *
   * @param query - The new search query string
   */
  onSearchChange(query: string): void {
    this.searchService.setSearchQuery(query);
    this.loadTasks();
  }

  /**
   * Handle task drag and drop event
   *
   * Processes drag-and-drop operations on the Kanban board. If a task
   * is moved to a different column, updates its status. If moved within
   * the same column, reorders the tasks.
   *
   * @param event - The CDK drag-drop event containing source and destination information
   */
  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Update task status
      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: () => {
          this.cdr.markForCheck();
        },
      });
    }
  }

  /**
   * Open task edit dialog
   *
   * Opens the task form dialog in edit mode with the selected task's data.
   * Reloads tasks after the dialog is closed if changes were made.
   *
   * @param task - The task to edit
   */
  onTaskEdit(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  /**
   * Delete a task
   *
   * Prompts the user for confirmation before deleting a task. If confirmed,
   * deletes the task and reloads the task list.
   *
   * @param task - The task to delete
   */
  onTaskDelete(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: () => {
          this.cdr.markForCheck();
        },
      });
    }
  }

  /**
   * Open task creation dialog
   *
   * Opens the task form dialog in create mode. Reloads tasks after
   * the dialog is closed if a new task was created.
   */
  onCreateTask(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  /**
   * Get task status from container ID
   *
   * Maps a Kanban column container ID to its corresponding task status.
   * Used when a task is dropped into a column to determine the new status.
   *
   * @param id - The container ID ('todo', 'in_progress', or 'done')
   * @returns The corresponding task status
   *
   * @private
   */
  private getStatusFromContainerId(id: string): TaskStatus {
    if (id === 'todo') return 'todo';
    if (id === 'in_progress') return 'in_progress';
    return 'done';
  }
}
