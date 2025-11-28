import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Sidebar Navigation Component
 * Displays the left sidebar with navigation links
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

  @Input() isOpen = false;

  navigationItems = [
    { label: 'Dashboard', icon: 'grid_view', route: '/dashboard', color: '#1976D2' },
    { label: 'Tasks', icon: 'task_alt', route: '/tasks', color: '#388E3C' },
    { label: 'Calendar', icon: 'date_range', route: '/calendar', color: '#FF6F00' },
    { label: 'Analytics', icon: 'trending_up', route: '/analytics', color: '#7B1FA2' },
    { label: 'Team', icon: 'supervisor_account', route: '/team', color: '#C2185B' },
    { label: 'Settings', icon: 'manage_accounts', route: '/settings', color: '#5F6368' },
  ];

  createNewTask(): void {
    // Navigate to tasks page with new task modal
    this.router.navigate(['/tasks'], { queryParams: { new: 'true' } });
  }

  getColorRgb(color: string): string {
    // Convert hex color to RGB string for rgba() usage
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
}
