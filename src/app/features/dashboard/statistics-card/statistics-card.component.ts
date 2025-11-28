import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatisticsItem } from '../../../types';

/**
 * Statistics Card Component (Presentational)
 * Displays a single statistics card
 */
@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './statistics-card.component.html',
  styleUrl: './statistics-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCardComponent {
  @Input({ required: true }) statistic!: StatisticsItem;
}

