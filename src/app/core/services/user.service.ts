import { Injectable, signal } from '@angular/core';
import { User } from '../../types';

/**
 * User Service
 * Manages user data and provides user-related utilities
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Mock users - in a real app, this would come from an API
  private readonly usersSignal = signal<User[]>([
    { id: 'user-001', name: 'John Doe', avatar: 'JD', email: 'john.doe@company.com' },
    { id: 'user-002', name: 'Sarah Smith', avatar: 'SS', email: 'sarah.smith@company.com' },
    { id: 'user-003', name: 'Mike Johnson', avatar: 'MJ', email: 'mike.johnson@company.com' },
    { id: 'user-004', name: 'Emily Davis', avatar: 'ED', email: 'emily.davis@company.com' },
  ]);

  readonly users = this.usersSignal.asReadonly();

  /**
   * Get all users
   */
  getUsers(): User[] {
    return this.usersSignal();
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): User | undefined {
    return this.usersSignal().find((user) => user.id === id);
  }

  /**
   * Get current user (mock implementation)
   */
  getCurrentUser(): User {
    return this.usersSignal()[0]; // Return first user as current user
  }
}

