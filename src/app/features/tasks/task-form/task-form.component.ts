import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../../../types';
import { TaskService, UserService } from '../../../core/services';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

// Custom date adapter to format dates as "dd mm, yyyy"
@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: any): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    }

    // Get the default format from parent class
    const defaultFormat = super.format(date, displayFormat);

    // Format datepicker header as "DD MMM, YYYY" (e.g., "30 Nov, 2025")
    // This handles the datepicker header which shows the selected date
    if (defaultFormat && typeof defaultFormat === 'string') {
      // Match pattern like "11/30/2025" (MM/DD/YYYY) or other date formats
      const mmddyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = defaultFormat.match(mmddyyyyPattern);
      if (match) {
        const [, month, day, year] = match;
        const monthIndex = parseInt(month, 10) - 1;
        const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
        // Format as "DD MMM, YYYY"
        return `${day.padStart(2, '0')} ${monthAbbr}, ${year}`;
      }
    }

    return defaultFormat;
  }

  override parse(value: any): Date | null {
    if (!value) return null;

    // Handle "dd mm, yyyy" format (e.g., "30 November, 2024")
    if (typeof value === 'string' && value.includes(',')) {
      const parts = value.split(',');
      if (parts.length === 2) {
        const datePart = parts[0].trim();
        const year = parseInt(parts[1].trim(), 10);
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const dateParts = datePart.split(' ');
        if (dateParts.length === 2) {
          const day = parseInt(dateParts[0], 10);
          const monthName = dateParts[1];
          const month = monthNames.indexOf(monthName);
          if (month !== -1 && !isNaN(day) && !isNaN(year)) {
            return new Date(year, month, day);
          }
        }
      }
    }

    // Fall back to default parsing
    return super.parse(value);
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
 * Task Form Component
 * Modal form for creating and editing tasks
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  @ViewChild('picker') datepicker!: MatDatepicker<Date>;
  taskForm: FormGroup;
  isEditMode = false;
  users: ReturnType<UserService['getUsers']> = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private taskService: TaskService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: ['todo', Validators.required],
      priority: ['medium', Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator]],
      assigneeId: ['', Validators.required],
      tags: [[]],
    });

    this.isEditMode = !!data?.task;
  }

  ngOnInit(): void {
    this.users = this.userService.getUsers();

    if (this.isEditMode && this.data.task) {
      const task = this.data.task;
      // Parse date from "YYYY-MM-DD" format as local date to avoid timezone issues
      const dateParts = task.dueDate.split('-');
      const parsedDate = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1, // Month is 0-indexed
        parseInt(dateParts[2], 10)
      );

      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: parsedDate,
        assigneeId: task.assignee.id,
        tags: task.tags || [],
      });
    }
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    // Allow today and future dates
    return selectedDate >= today ? null : { pastDate: true };
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const dueDate = formValue.dueDate as Date;
      // Format date in local timezone to avoid timezone conversion issues
      // Submit as "YYYY-MM-DD" format
      const year = dueDate.getFullYear();
      const month = String(dueDate.getMonth() + 1).padStart(2, '0');
      const day = String(dueDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const taskData: TaskFormData = {
        ...formValue,
        dueDate: formattedDate,
      };

      if (this.isEditMode && this.data.task) {
        this.taskService.updateTask(this.data.task.id, taskData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating task:', error);
            // Keep dialog open on error so user can retry
          },
        });
      } else {
        this.taskService.createTask(taskData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating task:', error);
            // Keep dialog open on error so user can retry
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const tags = this.taskForm.get('tags')?.value || [];
      this.taskForm.patchValue({ tags: [...tags, value] });
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const tags = this.taskForm.get('tags')?.value || [];
    const index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
      this.taskForm.patchValue({ tags });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('pastDate')) {
      return 'Due date cannot be in the past';
    }
    return '';
  }

  onDueDateFocus(): void {
    if (this.datepicker && !this.datepicker.opened) {
      this.datepicker.open();
    }
  }
}

