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
 * Main tasks page with Kanban board and filtering
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

  // Filter state
  readonly statusFilter = signal<TaskStatus | 'all'>('all');
  readonly priorityFilter = signal<TaskPriority | 'all'>('all');
  readonly searchQuery = this.searchService.searchQuery;

  // Task data
  readonly allTasks = this.taskService.tasks;
  readonly loading = this.taskService.loading;

  // Computed filtered tasks
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
          task.description.toLowerCase().includes(search)
      );
    }

    return tasks;
  });

  // Tasks grouped by status
  readonly todoTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === 'todo')
  );
  readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === 'in_progress')
  );
  readonly doneTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === 'done')
  );

  ngOnInit(): void {
    this.loadTasks();
  }

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

  onStatusFilterChange(status: TaskStatus | 'all'): void {
    this.statusFilter.set(status);
    this.loadTasks();
  }

  onPriorityFilterChange(priority: TaskPriority | 'all'): void {
    this.priorityFilter.set(priority);
    this.loadTasks();
  }

  onSearchChange(query: string): void {
    this.searchService.setSearchQuery(query);
    this.loadTasks();
  }

  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
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

  private getStatusFromContainerId(id: string): TaskStatus {
    if (id === 'todo') return 'todo';
    if (id === 'in_progress') return 'in_progress';
    return 'done';
  }
}

