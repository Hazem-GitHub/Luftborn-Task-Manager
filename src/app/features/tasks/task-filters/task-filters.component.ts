import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatus, TaskPriority } from '../../../types';

/**
 * Task Filters Component (Reusable)
 * Handles task filtering UI (status and priority filters)
 */
@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFiltersComponent {
  @Input() statusFilter: TaskStatus | 'all' = 'all';
  @Input() priorityFilter: TaskPriority | 'all' = 'all';
  @Input() showNewTaskButton: boolean = true;

  @Output() statusFilterChange = new EventEmitter<TaskStatus | 'all'>();
  @Output() priorityFilterChange = new EventEmitter<TaskPriority | 'all'>();
  @Output() newTaskClick = new EventEmitter<void>();

  onStatusFilterChange(status: TaskStatus | 'all'): void {
    this.statusFilterChange.emit(status);
  }

  onPriorityFilterChange(priority: TaskPriority | 'all'): void {
    this.priorityFilterChange.emit(priority);
  }

  onCreateTask(): void {
    this.newTaskClick.emit();
  }
}

