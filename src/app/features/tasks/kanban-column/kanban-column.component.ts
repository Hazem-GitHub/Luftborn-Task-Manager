import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus } from '../../../types';
import { TaskCardComponent } from '../task-card/task-card.component';
import { getStatusLabel } from '../../../shared/utils/task.utils';

/**
 * Kanban Column Component (Presentational)
 *
 * Displays a single column in the Kanban board for a specific task status.
 * Each column shows tasks of a particular status with drag-and-drop support.
 *
 * Features:
 * - Status-specific column with icon and label
 * - Task count display
 * - Drag-and-drop support for tasks
 * - Task edit and delete actions
 * - Colored background based on status
 *
 * @example
 * ```html
 * <app-kanban-column
 *   status="todo"
 *   [tasks]="todoTasks()"
 *   (taskDropped)="onTaskDropped($event)"
 *   (taskEdit)="onTaskEdit($event)"
 *   (taskDelete)="onTaskDelete($event)"
 * ></app-kanban-column>
 * ```
 *
 * @see {@link TaskCardComponent} for individual task display
 */
@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent, MatIconModule],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanColumnComponent {
  /**
   * The status this column represents
   * Must be one of: 'todo', 'in_progress', or 'done'
   */
  @Input({ required: true }) status!: TaskStatus;

  /**
   * Array of tasks to display in this column
   * Should be filtered to only include tasks with matching status
   */
  @Input({ required: true }) tasks: Task[] = [];

  /**
   * Event emitted when a task is dragged and dropped within or into this column
   */
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();

  /**
   * Event emitted when a task's edit button is clicked
   */
  @Output() taskEdit = new EventEmitter<Task>();

  /**
   * Event emitted when a task's delete button is clicked
   */
  @Output() taskDelete = new EventEmitter<Task>();

  /**
   * Get human-readable label for the status
   *
   * @returns Uppercase status label (e.g., 'TO DO', 'IN PROGRESS', 'DONE')
   */
  getStatusLabel(): string {
    return getStatusLabel(this.status);
  }

  /**
   * Get Material icon name for the status
   *
   * Returns the appropriate icon for each status:
   * - 'todo': 'radio_button_unchecked'
   * - 'in_progress': 'sync'
   * - 'done': 'check_circle'
   *
   * @returns Material icon name string
   */
  getStatusIcon(): string {
    const iconMap: Record<TaskStatus, string> = {
      todo: 'radio_button_unchecked',
      in_progress: 'sync',
      done: 'check_circle',
    };
    return iconMap[this.status] || 'circle';
  }

  /**
   * TrackBy function for efficient list rendering
   *
   * Used by Angular's *ngFor to track tasks by their ID,
   * improving performance when tasks are added, removed, or reordered.
   *
   * @param index - The index of the item in the array
   * @param task - The task object
   * @returns The unique identifier (task ID)
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  /**
   * Handle task drag and drop event
   *
   * Forwards the drag-drop event to the parent component.
   *
   * @param event - The CDK drag-drop event
   */
  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit(event);
  }

  /**
   * Handle task edit action
   *
   * Forwards the edit event to the parent component.
   *
   * @param task - The task to edit
   */
  onTaskEdit(task: Task): void {
    this.taskEdit.emit(task);
  }

  /**
   * Handle task delete action
   *
   * Forwards the delete event to the parent component.
   *
   * @param task - The task to delete
   */
  onTaskDelete(task: Task): void {
    this.taskDelete.emit(task);
  }
}
