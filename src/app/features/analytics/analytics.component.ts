import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services';
import { Task } from '../../types';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { Chart } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

/**
 * Analytics Component
 * Displays task analytics with charts
 */
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  readonly tasks = this.taskService.tasks;
  readonly loading = this.taskService.loading;

  // Priority Chart
  priorityChartType: ChartType = 'pie';
  priorityChartData: ChartData<'pie'> = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#D32F2F', '#FF6F00', '#1976D2'],
      },
    ],
  };
  priorityChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
    },
  };

  // Status Chart
  statusChartType: ChartType = 'bar';
  statusChartData: ChartData<'bar'> = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Tasks',
        data: [0, 0, 0],
        backgroundColor: ['#1976D2', '#FF6F00', '#388E3C'],
      },
    ],
  };
  statusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor() {
    // Use effect to update charts when tasks signal changes
    effect(() => {
      const tasks = this.tasks();
      if (tasks.length > 0 || !this.loading()) {
        this.updateCharts();
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    // Load tasks if not already loaded
    if (this.tasks().length === 0) {
      this.taskService.getTasks().subscribe({
        next: () => {
          this.updateCharts();
          this.cdr.markForCheck();
        },
        error: () => {
          this.cdr.markForCheck();
        },
      });
    } else {
      // If tasks are already loaded, update charts immediately
      this.updateCharts();
      this.cdr.markForCheck();
    }
  }

  private updateCharts(): void {
    const tasks = this.tasks();
    
    // Update priority chart
    const priorityCounts = {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    };
    
    // Create new object to trigger change detection
    this.priorityChartData = {
      labels: ['High', 'Medium', 'Low'],
      datasets: [
        {
          data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
          backgroundColor: ['rgba(211, 47, 47, 0.8)', 'rgba(255, 111, 0, 0.8)', 'rgba(25, 118, 210, 0.8)'],
          borderColor: ['rgba(211, 47, 47, 1)', 'rgba(255, 111, 0, 1)', 'rgba(25, 118, 210, 1)'],
          borderWidth: 1,
        },
      ],
    };

    // Update status chart
    const statusCounts = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
    
    // Create new object to trigger change detection
    this.statusChartData = {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [
        {
          label: 'Tasks',
          data: [statusCounts.todo, statusCounts.in_progress, statusCounts.done],
          backgroundColor: [
            'rgba(25, 118, 210, 0.8)',
            'rgba(255, 111, 0, 0.8)',
            'rgba(56, 142, 60, 0.8)',
          ],
          borderColor: [
            'rgba(25, 118, 210, 1)',
            'rgba(255, 111, 0, 1)',
            'rgba(56, 142, 60, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }
}

