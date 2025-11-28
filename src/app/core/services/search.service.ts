import { Injectable, signal } from '@angular/core';

/**
 * Search Service
 * Manages global search state
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly searchQuerySignal = signal<string>('');

  readonly searchQuery = this.searchQuerySignal.asReadonly();

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  clearSearch(): void {
    this.searchQuerySignal.set('');
  }
}

