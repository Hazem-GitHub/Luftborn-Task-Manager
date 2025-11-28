import { Injectable, signal } from '@angular/core';
import { User } from '../../types';

/**
 * User Service
 *
 * Service for managing user data and providing user-related operations.
 * Currently uses mock data, but designed to be easily replaceable with
 * API-based user management.
 *
 * @example
 * ```typescript
 * private userService = inject(UserService);
 *
 * // Get all users
 * const users = this.userService.getUsers();
 *
 * // Get current user
 * const currentUser = this.userService.getCurrentUser();
 *
 * // Get user by ID
 * const user = this.userService.getUserById('user-001');
 * ```
 *
 * @see {@link User} for user data structure
 * @todo Replace mock data with API integration
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Mock users data - in a real app, this would come from an API
   * @private
   */
  private readonly usersSignal = signal<User[]>([
    { id: 'user-001', name: 'John Doe', avatar: 'JD', email: 'john.doe@company.com' },
    { id: 'user-002', name: 'Sarah Smith', avatar: 'SS', email: 'sarah.smith@company.com' },
    { id: 'user-003', name: 'Mike Johnson', avatar: 'MJ', email: 'mike.johnson@company.com' },
    { id: 'user-004', name: 'Emily Davis', avatar: 'ED', email: 'emily.davis@company.com' },
  ]);

  /**
   * Readonly signal containing all users.
   * Updates automatically when users are fetched or modified.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Get all users
   *
   * Returns a snapshot of all available users.
   *
   * @returns Array of all users
   *
   * @example
   * ```typescript
   * const allUsers = this.userService.getUsers();
   * console.log('Total users:', allUsers.length);
   * ```
   */
  getUsers(): User[] {
    return this.usersSignal();
  }

  /**
   * Get user by ID
   *
   * Finds and returns a user with the specified ID.
   *
   * @param id - The unique identifier of the user
   * @returns User object if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const user = this.userService.getUserById('user-001');
   * if (user) {
   *   console.log('User found:', user.name);
   * }
   * ```
   */
  getUserById(id: string): User | undefined {
    return this.usersSignal().find((user) => user.id === id);
  }

  /**
   * Get current user (mock implementation)
   *
   * Returns the currently logged-in user. In this mock implementation,
   * it returns the first user in the list. In a production app, this
   * would return the authenticated user from a session or token.
   *
   * @returns The current user object
   *
   * @example
   * ```typescript
   * const currentUser = this.userService.getCurrentUser();
   * console.log('Logged in as:', currentUser.name);
   * ```
   *
   * @todo Implement proper authentication and session management
   */
  getCurrentUser(): User {
    return this.usersSignal()[0]; // Return first user as current user
  }
}
