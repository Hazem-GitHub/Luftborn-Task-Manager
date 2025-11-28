import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../types';

/**
 * Priority Label Pipe
 * Converts priority value to uppercase label
 */
@Pipe({
  name: 'priorityLabel',
  standalone: true,
})
export class PriorityLabelPipe implements PipeTransform {
  transform(value: TaskPriority): string {
    return value.toUpperCase();
  }
}

