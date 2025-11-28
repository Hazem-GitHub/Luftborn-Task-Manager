import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus } from '../../../types';
import { TaskCardComponent } from '../task-card/task-card.component';
import { getStatusLabel } from '../../../shared/utils/task.utils';

/**
 * Kanban Column Component (Presentational)
 * Displays a column of tasks for a specific status
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
  @Input({ required: true }) status!: TaskStatus;
  @Input({ required: true }) tasks: Task[] = [];
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() taskEdit = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<Task>();

  getStatusLabel(): string {
    return getStatusLabel(this.status);
  }

  getStatusIcon(): string {
    const iconMap: Record<TaskStatus, string> = {
      todo: 'radio_button_unchecked',
      in_progress: 'sync',
      done: 'check_circle',
    };
    return iconMap[this.status] || 'circle';
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit(event);
  }

  onTaskEdit(task: Task): void {
    this.taskEdit.emit(task);
  }

  onTaskDelete(task: Task): void {
    this.taskDelete.emit(task);
  }
}

