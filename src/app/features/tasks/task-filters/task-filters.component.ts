import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatus, TaskPriority } from '../../../types';

/**
 * Task Filters Component (Reusable/Presentational)
 *
 * Reusable component for task filtering UI. Displays status filter tabs
 * and priority dropdown with optional "New Task" button.
 *
 * Features:
 * - Status filter tabs (All, To Do, In Progress, Done) with icons
 * - Priority filter dropdown
 * - Optional "New Task" button
 * - Color-coded active states
 * - Responsive design
 *
 * @example
 * ```html
 * <app-task-filters
 *   [statusFilter]="statusFilter()"
 *   [priorityFilter]="priorityFilter()"
 *   [showNewTaskButton]="true"
 *   (statusFilterChange)="onStatusFilterChange($event)"
 *   (priorityFilterChange)="onPriorityFilterChange($event)"
 *   (newTaskClick)="onCreateTask()"
 * ></app-task-filters>
 * ```
 *
 * @see {@link TaskFiltersComponent} for usage in dashboard and tasks pages
 */
@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFiltersComponent {
  /**
   * Current status filter value
   * Determines which status tab is active
   */
  @Input() statusFilter: TaskStatus | 'all' = 'all';

  /**
   * Current priority filter value
   * Determines which priority is selected in dropdown
   */
  @Input() priorityFilter: TaskPriority | 'all' = 'all';

  /**
   * Whether to show the "New Task" button
   * Set to false to hide the button (e.g., in dashboard view)
   */
  @Input() showNewTaskButton: boolean = true;

  /**
   * Event emitted when status filter changes
   */
  @Output() statusFilterChange = new EventEmitter<TaskStatus | 'all'>();

  /**
   * Event emitted when priority filter changes
   */
  @Output() priorityFilterChange = new EventEmitter<TaskPriority | 'all'>();

  /**
   * Event emitted when "New Task" button is clicked
   */
  @Output() newTaskClick = new EventEmitter<void>();

  /**
   * Handle status filter tab click
   *
   * @param status - The selected status filter value
   */
  onStatusFilterChange(status: TaskStatus | 'all'): void {
    this.statusFilterChange.emit(status);
  }

  /**
   * Handle priority filter dropdown change
   *
   * @param priority - The selected priority filter value
   */
  onPriorityFilterChange(priority: TaskPriority | 'all'): void {
    this.priorityFilterChange.emit(priority);
  }

  /**
   * Handle "New Task" button click
   *
   * Emits the newTaskClick event to notify parent component
   * to open the task creation dialog.
   */
  onCreateTask(): void {
    this.newTaskClick.emit();
  }
}
