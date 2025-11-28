import { Task, TaskPriority, TaskStatus } from '../../types';

/**
 * Get priority color
 *
 * Returns the color code associated with a task priority level.
 * Used for styling priority badges and visual indicators.
 *
 * @param priority - The task priority level ('low' | 'medium' | 'high')
 * @returns Hex color code for the priority
 *
 * @example
 * ```typescript
 * const color = getPriorityColor('high'); // Returns '#D32F2F'
 * ```
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    high: '#D32F2F',
    medium: '#FF6F00',
    low: '#1976D2',
  };
  return colors[priority];
}

/**
 * Get status label
 *
 * Converts a task status value to a human-readable uppercase label
 * for display purposes.
 *
 * @param status - The task status ('todo' | 'in_progress' | 'done')
 * @returns Uppercase label string (e.g., 'TO DO', 'IN PROGRESS', 'DONE')
 *
 * @example
 * ```typescript
 * const label = getStatusLabel('in_progress'); // Returns 'IN PROGRESS'
 * ```
 */
export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    todo: 'TO DO',
    in_progress: 'IN PROGRESS',
    done: 'DONE',
  };
  return labels[status];
}

/**
 * Check if task is overdue
 *
 * Determines if a task's due date has passed. Completed tasks are never
 * considered overdue, regardless of their due date. Handles timezone issues
 * by parsing dates as local dates.
 *
 * @param task - The task to check
 * @returns True if the task is overdue, false otherwise
 *
 * @example
 * ```typescript
 * if (isTaskOverdue(task)) {
 *   console.log('This task is overdue!');
 * }
 * ```
 *
 * @remarks
 * - Completed tasks (status === 'done' or has completedAt) always return false
 * - Dates are parsed as local dates to avoid timezone conversion issues
 * - Comparison is done at midnight (start of day) for accuracy
 */
export function isTaskOverdue(task: Task): boolean {
  // Completed tasks are never overdue
  if (task.status === 'done' || task.completedAt) return false;

  // Parse "YYYY-MM-DD" as local date to avoid timezone issues
  const dateParts = task.dueDate.split('-');
  if (dateParts.length === 3) {
    const dueDate = new Date(
      parseInt(dateParts[0], 10),
      parseInt(dateParts[1], 10) - 1, // Month is 0-indexed
      parseInt(dateParts[2], 10),
    );
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < now;
  }

  // Fallback to default parsing
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < now;
}

/**
 * Get task border color based on priority and overdue status
 *
 * Determines the appropriate border color for a task card based on
 * its priority level and overdue status. High priority and overdue
 * tasks get red borders, medium priority gets orange, and low priority
 * gets blue.
 *
 * @param task - The task to get border color for
 * @returns Hex color code for the border
 *
 * @example
 * ```typescript
 * const borderColor = getTaskBorderColor(task);
 * // Returns '#D32F2F' for high priority or overdue
 * // Returns '#FF6F00' for medium priority
 * // Returns '#1976D2' for low priority
 * ```
 *
 * @remarks
 * - Overdue tasks always get red border regardless of priority
 * - High priority tasks get red border
 * - Medium priority tasks get orange border
 * - Low priority tasks get blue border
 */
export function getTaskBorderColor(task: Task): string {
  if (isTaskOverdue(task) || task.priority === 'high') {
    return '#D32F2F'; // Red for high priority or overdue
  }
  if (task.priority === 'medium') {
    return '#FF6F00'; // Orange for medium
  }
  return '#1976D2'; // Blue for low
}
