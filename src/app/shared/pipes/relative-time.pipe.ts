import { Pipe, PipeTransform } from '@angular/core';
import { format, differenceInDays, startOfDay } from 'date-fns';

/**
 * Relative Time Pipe
 *
 * Formats dates as human-readable relative time strings. Supports both
 * due dates and completion dates with different formatting based on the
 * prefix parameter.
 *
 * For due dates:
 * - "Due today", "Due tomorrow", "Due in X days", "Overdue by X days"
 *
 * For completed dates (with prefix='completed'):
 * - "today", "yesterday", "X days ago", "X weeks ago", "on [date]"
 *
 * @example
 * ```html
 * <!-- Due date -->
 * {{ task.dueDate | relativeTime }}
 *
 * <!-- Completed date -->
 * {{ task.completedAt | relativeTime:'completed' }}
 * ```
 *
 * @example
 * ```typescript
 * const pipe = new RelativeTimePipe();
 * pipe.transform('2025-12-31'); // "Due in 5 days"
 * pipe.transform('2025-11-20', 'completed'); // "2 days ago"
 * ```
 */
@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  /**
   * Transform a date value to a relative time string
   *
   * @param value - Date string (YYYY-MM-DD or ISO) or Date object
   * @param prefix - Optional prefix to control formatting:
   *                 - '' (default): Format as due date
   *                 - 'completed': Format as completion date
   * @returns Formatted relative time string
   */
  transform(value: string | Date, prefix: string = ''): string {
    if (!value) return '';

    // Parse date string as local date to avoid timezone issues
    let date: Date;
    if (typeof value === 'string') {
      // Handle ISO date strings (with time)
      if (value.includes('T')) {
        date = new Date(value);
      } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Handle "YYYY-MM-DD" format - parse as local date
        const [year, month, day] = value.split('-').map(Number);
        date = new Date(year, month - 1, day); // Month is 0-indexed
      } else {
        date = new Date(value);
      }
    } else {
      date = value;
    }

    // Normalize both dates to start of day for accurate comparison
    const normalizedDate = startOfDay(date);
    const normalizedNow = startOfDay(new Date());

    // Handle completed dates
    if (prefix === 'completed') {
      const daysAgo = differenceInDays(normalizedNow, normalizedDate);
      if (daysAgo === 0) {
        return 'today';
      } else if (daysAgo === 1) {
        return 'yesterday';
      } else if (daysAgo < 7) {
        return `${daysAgo} days ago`;
      } else if (daysAgo < 30) {
        const weeks = Math.floor(daysAgo / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      } else {
        return `on ${format(date, 'MMM d, yyyy')}`;
      }
    }

    // Handle due dates
    const isOverdue = normalizedDate < normalizedNow;

    if (isOverdue) {
      const daysOverdue = differenceInDays(normalizedNow, normalizedDate);
      return `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
    }

    const daysUntil = differenceInDays(normalizedDate, normalizedNow);
    if (daysUntil === 0) {
      return 'Due today';
    } else if (daysUntil === 1) {
      return 'Due tomorrow';
    } else if (daysUntil < 7) {
      return `Due in ${daysUntil} days`;
    } else if (daysUntil < 30) {
      const weeks = Math.floor(daysUntil / 7);
      return `Due in ${weeks} week${weeks !== 1 ? 's' : ''}`;
    }

    return format(date, 'MMM d, yyyy');
  }
}
