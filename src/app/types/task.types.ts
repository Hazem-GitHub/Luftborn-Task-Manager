/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Task status values
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * Change type for statistics
 */
export type ChangeType = 'positive' | 'negative' | 'neutral';

/**
 * User/Assignee interface
 */
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

/**
 * Task interface matching the data structure
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: User;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
  completedAt?: string;
}

/**
 * Statistics item interface
 */
export interface StatisticsItem {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: ChangeType;
  color: string;
}

/**
 * Statistics response interface
 */
export interface StatisticsResponse {
  statistics: StatisticsItem[];
  lastUpdated: string;
}

/**
 * Tasks response interface
 */
export interface TasksResponse {
  tasks: Task[];
  meta: {
    totalCount: number;
    lastUpdated: string;
  };
}

/**
 * Task filter interface
 */
export interface TaskFilter {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  assigneeId?: string | 'all';
  search?: string;
}

/**
 * Task form data interface
 */
export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  tags: string[];
}

