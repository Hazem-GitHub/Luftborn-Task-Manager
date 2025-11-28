import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UserService, SearchService } from '../../core/services';

/**
 * Header Component
 *
 * Application header component providing navigation, search functionality,
 * and user information. Includes responsive mobile search with collapsible
 * content.
 *
 * Features:
 * - Global search with automatic navigation to tasks page
 * - Mobile-responsive search with collapsible field
 * - Menu toggle for sidebar (mobile)
 * - User avatar display
 * - Notification button (placeholder)
 *
 * @example
 * ```html
 * <app-header (menuToggle)="onMenuToggle()"></app-header>
 * ```
 *
 * @see {@link SearchService} for search state management
 * @see {@link UserService} for user data
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private userService = inject(UserService);
  private searchService = inject(SearchService);
  private router = inject(Router);
  currentUser = this.userService.getCurrentUser();
  searchQuery = this.searchService.searchQuery;
  showMobileSearch = signal(false);

  /**
   * Event emitter for menu toggle
   * Emitted when the mobile menu button is clicked
   */
  @Output() menuToggle = new EventEmitter<void>();

  /**
   * Handle menu toggle button click
   *
   * Emits the menuToggle event to notify the parent component
   * (usually MainLayoutComponent) to toggle the sidebar.
   */
  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  /**
   * Handle search input change
   *
   * Updates the global search query and automatically navigates to the
   * tasks page if a search query is entered and the user is not already
   * on the tasks page.
   *
   * @param value - The search query string
   */
  onSearchChange(value: string): void {
    this.searchService.setSearchQuery(value);
    // Navigate to tasks page when search is performed
    if (value.trim() && !this.router.url.includes('/tasks')) {
      this.router.navigate(['/tasks']);
    }
  }

  /**
   * Toggle mobile search visibility
   *
   * Shows or hides the collapsible mobile search field. Automatically
   * focuses the input when expanded.
   */
  onSearchToggle(): void {
    this.showMobileSearch.update((value) => !value);
    // Focus input when expanded
    if (this.showMobileSearch()) {
      setTimeout(() => {
        const input = document.querySelector('.mobile-search-field input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }

  /**
   * Clear the search query
   *
   * Resets the global search query to an empty string.
   */
  clearSearch(): void {
    this.searchService.setSearchQuery('');
  }
}
