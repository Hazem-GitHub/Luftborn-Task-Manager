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
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StatisticsService, TaskService, UserService, SearchService } from '../../core/services';
import { StatisticsCardComponent } from './statistics-card/statistics-card.component';
import { TaskFiltersComponent } from '../tasks/task-filters/task-filters.component';
import { TaskBoardComponent } from '../tasks/task-board/task-board.component';
import { TaskFormComponent } from '../tasks/task-form/task-form.component';
import { Task, TaskStatus, TaskPriority, TaskFilter } from '../../types';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

/**
 * Dashboard Component (Smart/Container)
 * Main dashboard page displaying statistics and tasks
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatisticsCardComponent,
    TaskFiltersComponent,
    TaskBoardComponent,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private statisticsService = inject(StatisticsService);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private searchService = inject(SearchService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  // Statistics
  readonly statistics = this.statisticsService.statistics;
  readonly statisticsLoading = this.statisticsService.loading;

  // Tasks
  readonly allTasks = this.taskService.tasks;
  readonly tasksLoading = this.taskService.loading;

  // Filter state
  readonly statusFilter = signal<TaskStatus | 'all'>('all');
  readonly priorityFilter = signal<TaskPriority | 'all'>('all');
  readonly searchQuery = this.searchService.searchQuery;

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
    // Load statistics
    this.statisticsService.getStatistics().subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });

    // Load tasks
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

