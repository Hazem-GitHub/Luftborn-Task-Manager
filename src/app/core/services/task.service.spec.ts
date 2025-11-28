import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';
import { Task, TaskFormData } from '../../types';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks', () => {
    const mockTasks: Task[] = [
      {
        id: 'task-001',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        dueDate: '2025-12-01',
        assignee: {
          id: 'user-001',
          name: 'John Doe',
          avatar: 'JD',
          email: 'john@example.com',
        },
        tags: ['Test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a task', () => {
    const taskData: TaskFormData = {
      title: 'New Task',
      description: 'New Description',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-12-01',
      assigneeId: 'user-001',
      tags: ['New'],
    };

    const mockTask: Task = {
      id: 'task-002',
      ...taskData,
      assignee: {
        id: 'user-001',
        name: 'John Doe',
        avatar: 'JD',
        email: 'john@example.com',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    service.createTask(taskData).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTask);
  });

  it('should update a task', () => {
    const taskId = 'task-001';
    const updateData: Partial<TaskFormData> = {
      title: 'Updated Task',
    };

    const mockUpdatedTask: Task = {
      id: taskId,
      title: 'Updated Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-12-01',
      assignee: {
        id: 'user-001',
        name: 'John Doe',
        avatar: 'JD',
        email: 'john@example.com',
      },
      tags: ['Test'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    service.updateTask(taskId, updateData).subscribe((task) => {
      expect(task.title).toBe('Updated Task');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockUpdatedTask);
  });

  it('should delete a task', () => {
    const taskId = 'task-001';

    service.deleteTask(taskId).subscribe(() => {
      expect(true).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
