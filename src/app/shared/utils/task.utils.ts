import { Task, TaskPriority, TaskStatus } from '../../types';

/**
 * Get priority color
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
      parseInt(dateParts[2], 10)
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

