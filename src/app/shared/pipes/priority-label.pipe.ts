import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../types';

/**
 * Priority Label Pipe
 *
 * Converts a task priority value to an uppercase label for display.
 *
 * @example
 * ```html
 * {{ task.priority | priorityLabel }}
 * <!-- 'high' becomes 'HIGH' -->
 * <!-- 'medium' becomes 'MEDIUM' -->
 * <!-- 'low' becomes 'LOW' -->
 * ```
 *
 * @example
 * ```typescript
 * const pipe = new PriorityLabelPipe();
 * pipe.transform('high'); // Returns 'HIGH'
 * ```
 */
@Pipe({
  name: 'priorityLabel',
  standalone: true,
})
export class PriorityLabelPipe implements PipeTransform {
  /**
   * Transform priority value to uppercase label
   *
   * @param value - The task priority ('low' | 'medium' | 'high')
   * @returns Uppercase priority label
   */
  transform(value: TaskPriority): string {
    return value.toUpperCase();
  }
}
