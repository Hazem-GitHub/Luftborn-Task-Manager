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
 * Displays a single task card
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
  @Input({ required: true }) task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  getBorderColor(): string {
    return getTaskBorderColor(this.task);
  }

  isOverdue(): boolean {
    return isTaskOverdue(this.task);
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task);
  }
}

