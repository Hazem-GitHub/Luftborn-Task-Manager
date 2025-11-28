import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Task } from '../../../types';
import { RelativeTimePipe, PriorityLabelPipe } from '../../../shared/pipes';
import { getTaskBorderColor, isTaskOverdue } from '../../../shared/utils/task.utils';

/**
 * Task Card Component (Presentational)
 *
 * Displays a single task in a card format with all task information.
 * Shows priority badge, due date, assignee, tags, and action menu.
 *
 * Features:
 * - Priority badge with color coding
 * - Due date with relative time formatting
 * - Overdue indicator with red background
 * - Completed date display for done tasks
 * - Assignee avatar and name
 * - Tags display
 * - Edit and delete actions via menu
 * - Visual indicators (icons) for date status
 *
 * @example
 * ```html
 * <app-task-card
 *   [task]="task"
 *   (edit)="onTaskEdit($event)"
 *   (delete)="onTaskDelete($event)"
 * ></app-task-card>
 * ```
 *
 * @see {@link RelativeTimePipe} for date formatting
 * @see {@link PriorityLabelPipe} for priority display
 */
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RelativeTimePipe,
    PriorityLabelPipe,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  /**
   * The task to display
   * Required input that contains all task data
   */
  @Input({ required: true }) task!: Task;

  /**
   * Event emitted when the edit button is clicked
   * Passes the task object to the parent component
   */
  @Output() edit = new EventEmitter<Task>();

  /**
   * Event emitted when the delete button is clicked
   * Passes the task object to the parent component
   */
  @Output() delete = new EventEmitter<Task>();

  /**
   * Get border color for the task card
   *
   * Returns the appropriate border color based on task priority
   * and overdue status. Used for left border styling.
   *
   * @returns Hex color code for the border
   */
  getBorderColor(): string {
    return getTaskBorderColor(this.task);
  }

  /**
   * Check if the task is overdue
   *
   * Determines if the task's due date has passed.
   * Completed tasks are never considered overdue.
   *
   * @returns True if task is overdue, false otherwise
   */
  isOverdue(): boolean {
    return isTaskOverdue(this.task);
  }

  /**
   * Handle edit button click
   *
   * Emits the edit event with the task data to notify
   * the parent component to open the edit dialog.
   */
  onEdit(): void {
    this.edit.emit(this.task);
  }

  /**
   * Handle delete button click
   *
   * Emits the delete event with the task data to notify
   * the parent component to delete the task.
   */
  onDelete(): void {
    this.delete.emit(this.task);
  }
}
