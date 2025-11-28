import { Injectable, signal } from '@angular/core';

/**
 * Search Service
 *
 * Global service for managing search state across the application.
 * Provides a centralized way to share search queries between components
 * using Angular signals for reactive updates.
 *
 * @example
 * ```typescript
 * private searchService = inject(SearchService);
 *
 * // Set search query
 * this.searchService.setSearchQuery('important task');
 *
 * // Access reactive search query
 * const query = this.searchService.searchQuery();
 *
 * // Clear search
 * this.searchService.clearSearch();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * Internal signal storing the current search query
   * @private
   */
  private readonly searchQuerySignal = signal<string>('');

  /**
   * Readonly signal containing the current search query.
   * Components can subscribe to this signal to reactively update
   * when the search query changes.
   */
  readonly searchQuery = this.searchQuerySignal.asReadonly();

  /**
   * Set the search query
   *
   * Updates the global search query, which will trigger reactive
   * updates in all components that depend on it.
   *
   * @param query - The search query string
   *
   * @example
   * ```typescript
   * // Set search from input
   * onSearchInput(value: string) {
   *   this.searchService.setSearchQuery(value);
   * }
   * ```
   */
  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  /**
   * Clear the search query
   *
   * Resets the search query to an empty string, effectively
   * clearing the search filter.
   *
   * @example
   * ```typescript
   * onClearSearch() {
   *   this.searchService.clearSearch();
   * }
   * ```
   */
  clearSearch(): void {
    this.searchQuerySignal.set('');
  }
}
