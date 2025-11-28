# Angular Task Management Dashboard

A modern, production-ready Task Management Dashboard built with Angular 21, featuring standalone components, signals, comprehensive testing, and enterprise-level development practices.

## 🚀 Features

### Core Functionality
- **Task Management**
  - Create, edit, and delete tasks with full CRUD operations
  - Task filtering by status (To Do, In Progress, Done), priority, and assignee
  - Real-time search across task titles and descriptions
  - Drag & drop functionality to reorder tasks and change status
  - Rich task cards with priority badges, assignees, tags, and due dates

- **Dashboard Features**
  - Statistics cards displaying total tasks, completed tasks, in-progress tasks, and overdue tasks
  - Task analytics with visual charts showing task distribution by priority and status
  - Modern Kanban board view for task management
  - User management with assignee selection

### Technical Highlights
- **Modern Angular Features**
  - Standalone Components (Angular 21)
  - Signals for reactive state management
  - Lazy loading with route-based code splitting
  - OnPush change detection strategy for optimal performance

- **Architecture & Patterns**
  - Smart/Presentational (dumb) Component pattern
  - Dependency Injection best practices
  - SOLID principles and clean code architecture
  - HTTP interceptors for caching and error handling

- **Forms**
  - Reactive Forms with custom validators
  - Dynamic form controls
  - Proper error handling and display
  - Form state management

- **Performance Optimization**
  - OnPush change detection strategy
  - Lazy loading and code splitting
  - HTTP response caching
  - Proper RxJS operator usage (avoiding memory leaks)
  - TrackBy functions for efficient list rendering

- **UI/UX**
  - Angular Material component library
  - Responsive design (mobile, tablet, desktop)
  - Loading states and skeleton screens
  - Smooth animations and transitions
  - Accessibility (a11y) best practices

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI 21

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Luftborn-Task-Manager
```

2. Install dependencies:
```bash
npm install
```

3. Generate fresh data:
```bash
npm run generate-data
```

## 🚀 Running the Application

### Development Mode

Start both the JSON Server (mock backend) and Angular dev server:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1: Start JSON Server
npm run server

# Terminal 2: Start Angular dev server
npm start
```

The application will be available at `http://localhost:4200`
The API server will be running at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 📝 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

## 📁 Project Structure

```
src/
├── app/
│   ├── core/              # Singleton services, guards, interceptors
│   │   ├── interceptors/ # HTTP interceptors (cache, error handling)
│   │   └── services/      # Core services (Task, Statistics, User, Search)
│   ├── shared/            # Reusable components, pipes, directives, utilities
│   │   ├── pipes/         # Custom pipes (relative-time, priority-label)
│   │   └── utils/         # Utility functions
│   ├── features/          # Feature modules
│   │   ├── dashboard/     # Dashboard page with statistics
│   │   ├── tasks/         # Task management with Kanban board
│   │   └── analytics/     # Analytics page with charts
│   ├── layouts/           # Application layouts (sidebar, header, main)
│   └── types/             # TypeScript interfaces and types
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## 🏗️ Architecture Decisions

### State Management
- **Signals**: Used for reactive state management throughout the application
- **Services**: Centralized state management using Angular services with signals
- **Computed Signals**: Derived state computed from base signals

### Component Architecture
- **Smart/Dumb Pattern**: Clear separation between container (smart) and presentational (dumb) components
- **Standalone Components**: All components are standalone for better tree-shaking and lazy loading
- **OnPush Change Detection**: Used in all presentational components for optimal performance

### API Integration
- **JSON Server**: Mock backend for development
- **HTTP Interceptors**: 
  - Cache interceptor for GET requests (5-minute cache duration)
  - Error interceptor for global error handling
- **HTTPResource**: Standard HttpClient with proper error handling and retry logic

### Performance Optimizations
1. **Lazy Loading**: Feature modules loaded on demand
2. **OnPush Strategy**: Reduces change detection cycles
3. **TrackBy Functions**: Efficient list rendering
4. **HTTP Caching**: Reduces unnecessary API calls
5. **Code Splitting**: Route-based code splitting

## 🎨 Design Patterns

- **Dependency Injection**: Used throughout for testability and maintainability
- **Observer Pattern**: RxJS observables for async operations
- **Strategy Pattern**: Different filtering strategies for tasks
- **Factory Pattern**: Service factories for creating instances

## 🔧 Configuration

### Environment Variables
- `environment.ts`: Development configuration
- `environment.prod.ts`: Production configuration

### JSON Server
The mock backend uses `db.json` which is generated from `generate-data.js`. Run `npm run generate-data` to regenerate fresh data with current dates.

## 📊 Data Structure

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: User;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
  completedAt?: string;
}
```

## 🚧 Known Limitations

1. **Mock Backend**: Currently uses JSON Server; in production, replace with real API
2. **User Management**: Basic mock implementation; needs full user service
3. **Real-time Updates**: No WebSocket implementation for real-time collaboration
4. **Offline Support**: No service worker or offline capabilities
5. **Internationalization**: No i18n implementation (can be added)

## 🔮 Future Improvements

- [ ] Add WebSocket support for real-time updates
- [ ] Implement service worker for offline support
- [ ] Add internationalization (i18n)
- [ ] Implement advanced filtering and sorting
- [ ] Add task comments and attachments
- [ ] Implement task templates
- [ ] Add calendar view
- [ ] Implement task dependencies
- [ ] Add notifications system
- [ ] Implement dark mode

## 📚 Technology Stack

- **Framework**: Angular 21
- **UI Library**: Angular Material
- **State Management**: Angular Signals
- **Charts**: Chart.js with ng2-charts
- **Date Handling**: date-fns
- **Mock Backend**: JSON Server
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier, Husky

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository.
