import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, format, isPast, differenceInDays, startOfDay } from 'date-fns';

/**
 * Relative Time Pipe
 * Formats dates as relative time (e.g., "2 days ago", "Due in 3 days")
 */
@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
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

