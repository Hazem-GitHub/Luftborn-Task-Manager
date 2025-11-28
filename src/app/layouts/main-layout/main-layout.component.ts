import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

/**
 * Main Layout Component
 *
 * Root layout component that wraps the entire application with a header
 * and sidebar. Manages the overall page structure and responsive behavior.
 *
 * Features:
 * - Application header at the top
 * - Sidebar navigation on the left
 * - Main content area with router outlet
 * - Responsive sidebar toggle for mobile
 *
 * @example
 * ```html
 * <app-main-layout>
 *   <!-- Router outlet renders child routes here -->
 * </app-main-layout>
 * ```
 *
 * @see {@link HeaderComponent} for header implementation
 * @see {@link SidebarComponent} for sidebar implementation
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  /**
   * Signal controlling sidebar visibility on mobile
   * True when sidebar should be visible as an overlay
   */
  sidebarOpen = signal(false);

  /**
   * Toggle sidebar visibility
   *
   * Switches the sidebar between open and closed states.
   * Used primarily for mobile responsive behavior.
   */
  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }
}
