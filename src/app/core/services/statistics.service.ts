import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatisticsItem } from '../../types';

/**
 * Statistics Service
 *
 * Service responsible for fetching and managing statistics data for the dashboard.
 * Uses Angular signals for reactive state management.
 *
 * @example
 * ```typescript
 * private statisticsService = inject(StatisticsService);
 *
 * // Fetch statistics
 * this.statisticsService.getStatistics().subscribe();
 *
 * // Access reactive state
 * const stats = this.statisticsService.statistics();
 * const isLoading = this.statisticsService.loading();
 * ```
 *
 * @see {@link StatisticsItem} for statistics data structure
 */
@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/statistics`;

  // Signal-based state management
  private readonly statisticsSignal = signal<StatisticsItem[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal containing all statistics items.
   * Updates automatically when statistics are fetched.
   */
  readonly statistics = this.statisticsSignal.asReadonly();

  /**
   * Readonly signal indicating if statistics are being loaded.
   * True during API calls, false otherwise.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal containing error messages from failed operations.
   * Null when no errors occur.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Get statistics from the API
   *
   * Fetches statistics data including total tasks, completed tasks,
   * in-progress tasks, and overdue tasks with their respective metrics.
   *
   * @returns Observable that emits an array of statistics items
   *
   * @example
   * ```typescript
   * this.statisticsService.getStatistics().subscribe({
   *   next: (stats) => console.log('Statistics:', stats),
   *   error: (err) => console.error('Failed to load statistics:', err)
   * });
   * ```
   */
  getStatistics(): Observable<StatisticsItem[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<StatisticsItem[]>(this.apiUrl).pipe(
      tap({
        next: (statistics) => {
          this.statisticsSignal.set(statistics);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        },
      }),
    );
  }
}
