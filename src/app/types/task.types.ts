/**
 * Task priority levels
 *
 * Defines the three priority levels available for tasks.
 * Used for filtering, sorting, and visual indicators.
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Task status values
 *
 * Defines the three possible states a task can be in.
 * Used for Kanban board columns and filtering.
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * Change type for statistics
 *
 * Indicates whether a statistic change is positive (increase),
 * negative (decrease), or neutral (no change).
 */
export type ChangeType = 'positive' | 'negative' | 'neutral';

/**
 * User/Assignee interface
 *
 * Represents a user who can be assigned to tasks.
 * Contains basic user information and avatar for display.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'user-001',
 *   name: 'John Doe',
 *   avatar: 'JD',
 *   email: 'john.doe@company.com'
 * };
 * ```
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full name of the user */
  name: string;
  /** Avatar initials or emoji for display */
  avatar: string;
  /** User's email address */
  email: string;
}

/**
 * Task interface matching the data structure
 *
 * Represents a task in the system with all its properties.
 * This interface matches the structure returned by the API.
 *
 * @example
 * ```typescript
 * const task: Task = {
 *   id: 'task-001',
 *   title: 'Complete project',
 *   description: 'Finish the Angular project',
 *   status: 'in_progress',
 *   priority: 'high',
 *   dueDate: '2025-12-31',
 *   assignee: { id: 'user-001', name: 'John Doe', ... },
 *   tags: ['urgent', 'important'],
 *   createdAt: '2025-11-01T10:00:00Z',
 *   updatedAt: '2025-11-15T14:30:00Z'
 * };
 * ```
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Task title/summary */
  title: string;
  /** Detailed task description */
  description: string;
  /** Current status of the task */
  status: TaskStatus;
  /** Priority level of the task */
  priority: TaskPriority;
  /** Due date in YYYY-MM-DD format */
  dueDate: string;
  /** User assigned to the task */
  assignee: User;
  /** Array of tag strings for categorization */
  tags: string[];
  /** ISO timestamp when task was created */
  createdAt: string;
  /** ISO timestamp when task was last updated */
  updatedAt: string;
  /** Optional flag indicating if task is overdue (computed) */
  isOverdue?: boolean;
  /** Optional ISO timestamp when task was completed */
  completedAt?: string;
}

/**
 * Statistics item interface
 *
 * Represents a single statistic card displayed on the dashboard.
 * Contains the metric value, change indicator, and display properties.
 *
 * @example
 * ```typescript
 * const stat: StatisticsItem = {
 *   id: 'stat-001',
 *   title: 'Total Tasks',
 *   icon: 'list_alt',
 *   value: 156,
 *   change: '+12',
 *   changeLabel: 'this week',
 *   changeType: 'positive',
 *   color: '#1976D2'
 * };
 * ```
 */
export interface StatisticsItem {
  /** Unique identifier for the statistic */
  id: string;
  /** Display title of the statistic */
  title: string;
  /** Material icon name for the statistic */
  icon: string;
  /** Current numeric value */
  value: number;
  /** Change indicator (e.g., '+12', '-3', '0') */
  change: string;
  /** Label describing the change period (e.g., 'this week', 'today') */
  changeLabel: string;
  /** Type of change (positive, negative, or neutral) */
  changeType: ChangeType;
  /** Hex color code for the statistic card */
  color: string;
}

/**
 * Statistics response interface
 *
 * Structure for API responses containing statistics data.
 */
export interface StatisticsResponse {
  /** Array of statistics items */
  statistics: StatisticsItem[];
  /** ISO timestamp of last update */
  lastUpdated: string;
}

/**
 * Tasks response interface
 *
 * Structure for API responses containing tasks data with metadata.
 */
export interface TasksResponse {
  /** Array of tasks */
  tasks: Task[];
  /** Response metadata */
  meta: {
    /** Total count of tasks */
    totalCount: number;
    /** ISO timestamp of last update */
    lastUpdated: string;
  };
}

/**
 * Task filter interface
 *
 * Defines filter criteria for querying tasks.
 * All properties are optional and can be combined.
 *
 * @example
 * ```typescript
 * const filter: TaskFilter = {
 *   status: 'todo',
 *   priority: 'high',
 *   search: 'important'
 * };
 * ```
 */
export interface TaskFilter {
  /** Filter by task status, 'all' to show all statuses */
  status?: TaskStatus | 'all';
  /** Filter by task priority, 'all' to show all priorities */
  priority?: TaskPriority | 'all';
  /** Filter by assignee ID, 'all' to show all assignees */
  assigneeId?: string | 'all';
  /** Search query to filter by title or description */
  search?: string;
}

/**
 * Task form data interface
 *
 * Structure for task form submission data.
 * Used when creating or updating tasks through the form.
 *
 * @example
 * ```typescript
 * const formData: TaskFormData = {
 *   title: 'New Task',
 *   description: 'Task description',
 *   status: 'todo',
 *   priority: 'high',
 *   dueDate: '2025-12-31',
 *   assigneeId: 'user-001',
 *   tags: ['urgent', 'important']
 * };
 * ```
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
