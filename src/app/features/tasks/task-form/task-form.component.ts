import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
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
import {
  MatNativeDateModule,
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskFormData } from '../../../types';
import { TaskService, UserService } from '../../../core/services';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

/**
 * Custom Date Adapter
 *
 * Extends Angular Material's NativeDateAdapter to provide custom date formatting.
 * Formats dates as "dd mm, yyyy" (e.g., "30 November, 2024") in the input field
 * and "DD MMM, YYYY" (e.g., "30 Nov, 2025") in the datepicker header.
 *
 * Handles timezone issues by parsing dates as local dates rather than UTC.
 *
 * @example
 * ```typescript
 * // In component providers
 * { provide: DateAdapter, useClass: CustomDateAdapter }
 * ```
 */
@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  /**
   * Format a date for display
   *
   * Formats dates according to the display format:
   * - 'input': Formats as "dd mm, yyyy" (e.g., "30 November, 2024")
   * - Other formats: Formats datepicker header as "DD MMM, YYYY" (e.g., "30 Nov, 2025")
   *
   * @param date - The date to format
   * @param displayFormat - The format type ('input' or other)
   * @returns Formatted date string
   */
  override format(date: Date, displayFormat: string | object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
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
        const monthAbbr = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ][monthIndex];
        // Format as "DD MMM, YYYY"
        return `${day.padStart(2, '0')} ${monthAbbr}, ${year}`;
      }
    }

    return defaultFormat;
  }

  /**
   * Parse a date string to a Date object
   *
   * Handles parsing of "dd mm, yyyy" format (e.g., "30 November, 2024")
   * and falls back to default parsing for other formats.
   *
   * @param value - The date string to parse
   * @returns Parsed Date object or null if parsing fails
   */
  override parse(value: string | Date | null | undefined): Date | null {
    if (!value) return null;

    // Handle "dd mm, yyyy" format (e.g., "30 November, 2024")
    if (typeof value === 'string' && value.includes(',')) {
      const parts = value.split(',');
      if (parts.length === 2) {
        const datePart = parts[0].trim();
        const year = parseInt(parts[1].trim(), 10);
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
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
 *
 * Dialog component for creating and editing tasks. Supports both create
 * and edit modes based on the data passed to the dialog.
 *
 * Features:
 * - Reactive form with validation
 * - Custom date formatting and validation
 * - Tag management with chip input
 * - Status, priority, and assignee selection
 * - Automatic datepicker opening on focus
 *
 * @example
 * ```typescript
 * // Open in create mode
 * this.dialog.open(TaskFormComponent, {
 *   data: {}
 * });
 *
 * // Open in edit mode
 * this.dialog.open(TaskFormComponent, {
 *   data: { task: existingTask }
 * });
 * ```
 *
 * @see {@link TaskFormData} for form data structure
 * @see {@link CustomDateAdapter} for date formatting
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
  /**
   * Reference to the datepicker component
   * Used to programmatically open the datepicker on input focus
   */
  @ViewChild('picker') datepicker!: MatDatepicker<Date>;

  /**
   * Reactive form group for task data
   * Contains controls for all task fields with validation
   */
  taskForm: FormGroup;

  /**
   * Indicates if the form is in edit mode
   * True when editing an existing task, false when creating a new one
   */
  isEditMode = false;

  /**
   * List of available users for assignment
   * Populated from UserService on component initialization
   */
  users: ReturnType<UserService['getUsers']> = [];

  /**
   * Key codes that trigger tag addition
   * ENTER and COMMA keys will add a new tag
   */
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Inject(MAT_DIALOG_DATA) public data: { task?: Task }) {
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

  /**
   * Component initialization
   *
   * Loads users and populates the form if in edit mode.
   * Handles date parsing to avoid timezone issues.
   */
  ngOnInit(): void {
    this.users = this.userService.getUsers();

    if (this.isEditMode && this.data.task) {
      const task = this.data.task;
      // Parse date from "YYYY-MM-DD" format as local date to avoid timezone issues
      const dateParts = task.dueDate.split('-');
      const parsedDate = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1, // Month is 0-indexed
        parseInt(dateParts[2], 10),
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

  /**
   * Custom validator for due date
   *
   * Ensures that the selected due date is not in the past.
   * Allows today and future dates only.
   *
   * @param control - The form control to validate
   * @returns Validation error object if date is in the past, null otherwise
   *
   * @example
   * ```typescript
   * // Used in form control
   * dueDate: ['', [Validators.required, this.futureDateValidator]]
   * ```
   */
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    // Allow today and future dates
    return selectedDate >= today ? null : { pastDate: true };
  }

  /**
   * Handle form submission
   *
   * Validates the form and either creates a new task or updates an existing one
   * based on the edit mode. Formats the date as "YYYY-MM-DD" for API submission.
   * Closes the dialog on success, keeps it open on error for retry.
   */
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

  /**
   * Handle cancel button click
   *
   * Closes the dialog without saving any changes.
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Add a tag to the task
   *
   * Adds a new tag when user presses ENTER or COMMA in the tag input field.
   *
   * @param event - The chip input event containing the tag value
   */
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const tags = this.taskForm.get('tags')?.value || [];
      this.taskForm.patchValue({ tags: [...tags, value] });
    }
    event.chipInput!.clear();
  }

  /**
   * Remove a tag from the task
   *
   * Removes the specified tag from the task's tag list.
   *
   * @param tag - The tag string to remove
   */
  removeTag(tag: string): void {
    const tags = this.taskForm.get('tags')?.value || [];
    const index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
      this.taskForm.patchValue({ tags });
    }
  }

  /**
   * Get error message for a form control
   *
   * Returns a user-friendly error message based on the validation errors
   * present on the specified form control.
   *
   * @param controlName - The name of the form control
   * @returns Error message string or empty string if no errors
   *
   * @example
   * ```html
   * <mat-error>{{ getErrorMessage('title') }}</mat-error>
   * ```
   */
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

  /**
   * Handle due date input focus
   *
   * Automatically opens the datepicker when the due date input field
   * receives focus, improving user experience.
   */
  onDueDateFocus(): void {
    if (this.datepicker && !this.datepicker.opened) {
      this.datepicker.open();
    }
  }
}
