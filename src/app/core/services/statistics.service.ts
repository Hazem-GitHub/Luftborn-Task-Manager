import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatisticsItem, StatisticsResponse } from '../../types';

/**
 * Statistics Service
 * Handles statistics data fetching
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

  // Public readonly signals
  readonly statistics = this.statisticsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Get statistics
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
      })
    );
  }
}

