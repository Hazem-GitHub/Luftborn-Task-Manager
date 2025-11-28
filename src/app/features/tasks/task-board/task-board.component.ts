import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { Task } from '../../../types';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

/**
 * Task Board Component (Reusable/Presentational)
 *
 * Reusable component that displays a Kanban board with three columns
 * (To Do, In Progress, Done). Handles drag-and-drop events and task actions.
 *
 * Features:
 * - Three Kanban columns for different task statuses
 * - Drag-and-drop support for moving tasks between columns
 * - Loading state display
 * - Task edit and delete actions
 *
 * @example
 * ```html
 * <app-task-board
 *   [todoTasks]="todoTasks()"
 *   [inProgressTasks]="inProgressTasks()"
 *   [doneTasks]="doneTasks()"
 *   [loading]="loading()"
 *   (taskDropped)="onTaskDropped($event)"
 *   (taskEdit)="onTaskEdit($event)"
 *   (taskDelete)="onTaskDelete($event)"
 * ></app-task-board>
 * ```
 *
 * @see {@link KanbanColumnComponent} for individual column implementation
 */
@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, MatProgressSpinnerModule, KanbanColumnComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoardComponent {
  /**
   * Tasks with 'todo' status
   * Displayed in the first column
   */
  @Input() todoTasks: Task[] = [];

  /**
   * Tasks with 'in_progress' status
   * Displayed in the second column
   */
  @Input() inProgressTasks: Task[] = [];

  /**
   * Tasks with 'done' status
   * Displayed in the third column
   */
  @Input() doneTasks: Task[] = [];

  /**
   * Loading state indicator
   * Shows spinner when true
   */
  @Input() loading: boolean = false;

  /**
   * Event emitted when a task is dragged and dropped
   * Contains drag-drop event data for status update
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
   * Handle task drag and drop event
   *
   * Forwards the drag-drop event to the parent component
   * for processing (status update, reordering, etc.).
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
