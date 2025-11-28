import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { Task } from '../../../types';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

/**
 * Task Board Component (Reusable)
 * Displays the Kanban board with task columns
 */
@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    MatProgressSpinnerModule,
    KanbanColumnComponent,
  ],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoardComponent {
  @Input() todoTasks: Task[] = [];
  @Input() inProgressTasks: Task[] = [];
  @Input() doneTasks: Task[] = [];
  @Input() loading: boolean = false;

  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() taskEdit = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<Task>();

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

