import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Sidebar Navigation Component
 *
 * Displays the application's main navigation sidebar with colored links
 * and a "New Task" button. Supports responsive behavior with mobile overlay.
 *
 * Features:
 * - Navigation links with Material icons
 * - Color-coded navigation items
 * - Active route highlighting
 * - "New Task" button
 * - Responsive mobile overlay
 *
 * @example
 * ```html
 * <app-sidebar [isOpen]="sidebarOpen()"></app-sidebar>
 * ```
 *
 * @see {@link RouterModule} for navigation
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);

  /**
   * Controls sidebar visibility on mobile
   * When true, sidebar is visible as an overlay on mobile devices
   */
  @Input() isOpen = false;

  /**
   * Navigation items configuration
   *
   * Array of navigation items with label, icon, route, and color.
   * Each item is displayed as a link in the sidebar.
   */
  navigationItems = [
    { label: 'Dashboard', icon: 'grid_view', route: '/dashboard', color: '#1976D2' },
    { label: 'Tasks', icon: 'task_alt', route: '/tasks', color: '#388E3C' },
    { label: 'Calendar', icon: 'date_range', route: '/calendar', color: '#FF6F00' },
    { label: 'Analytics', icon: 'trending_up', route: '/analytics', color: '#7B1FA2' },
    { label: 'Team', icon: 'supervisor_account', route: '/team', color: '#C2185B' },
    { label: 'Settings', icon: 'manage_accounts', route: '/settings', color: '#5F6368' },
  ];

  /**
   * Handle "New Task" button click
   *
   * Navigates to the tasks page with a query parameter to trigger
   * the new task dialog.
   */
  createNewTask(): void {
    // Navigate to tasks page with new task modal
    this.router.navigate(['/tasks'], { queryParams: { new: 'true' } });
  }

  /**
   * Convert hex color to RGB string
   *
   * Converts a hex color code (e.g., '#1976D2') to an RGB string
   * (e.g., '25, 118, 210') for use in rgba() CSS functions.
   *
   * @param color - Hex color code (with or without #)
   * @returns RGB string in format "r, g, b"
   *
   * @example
   * ```typescript
   * const rgb = this.getColorRgb('#1976D2'); // Returns "25, 118, 210"
   * // Can be used in CSS: rgba(25, 118, 210, 0.1)
   * ```
   */
  getColorRgb(color: string): string {
    // Convert hex color to RGB string for rgba() usage
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
}
