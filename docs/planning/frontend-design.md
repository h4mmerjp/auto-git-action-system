# Frontend Design Specification - Task Management App

## Design System Foundation

### Color Palette
```css
/* Primary Colors */
--primary-blue: #1976d2;
--primary-blue-light: #42a5f5;
--primary-blue-dark: #1565c0;

/* Secondary Colors */
--secondary-orange: #ff9800;
--secondary-orange-light: #ffb74d;
--secondary-orange-dark: #f57c00;

/* Status Colors */
--success-green: #4caf50;
--warning-yellow: #ff9800;
--error-red: #f44336;
--info-blue: #2196f3;

/* Neutral Colors */
--grey-50: #fafafa;
--grey-100: #f5f5f5;
--grey-200: #eeeeee;
--grey-300: #e0e0e0;
--grey-500: #9e9e9e;
--grey-700: #616161;
--grey-900: #212121;
```

### Typography Scale
```css
/* Font Family */
--font-primary: 'Inter', 'Roboto', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Layout Architecture

### Main Application Layout
```tsx
interface AppLayoutProps {
  children: React.ReactNode;
  user: User;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, user }) => {
  return (
    <div className="app-layout">
      <AppHeader user={user} />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      <AppFooter />
    </div>
  );
};
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

## Core Components

### 1. Project Dashboard
**Purpose**: Main overview page showing all projects and quick stats

**Visual Specifications**:
- Grid layout with project cards (3-4 columns on desktop)
- Each card shows project name, progress bar, due date, team members
- Add new project button prominently placed
- Filter and search functionality in header

**Component Structure**:
```tsx
interface ProjectDashboardProps {
  projects: Project[];
  onCreateProject: () => void;
  onProjectSelect: (id: string) => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  onCreateProject,
  onProjectSelect
}) => {
  return (
    <div className="project-dashboard">
      <DashboardHeader 
        title="Projects"
        onCreateNew={onCreateProject}
      />
      <ProjectFilters />
      <ProjectGrid 
        projects={projects}
        onSelect={onProjectSelect}
      />
    </div>
  );
};
```

### 2. Hierarchical Task Tree
**Purpose**: Display and manage nested task structure with drag-and-drop

**Visual Specifications**:
- Expandable/collapsible tree structure
- Indentation levels to show hierarchy (16px per level)
- Drag handles for reordering
- Task status indicators (color-coded dots)
- Quick action buttons (add subtask, edit, delete)

**Component Structure**:
```tsx
interface TaskTreeProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskMove: (taskId: string, newParentId: string, position: number) => void;
  onTaskCreate: (parentId: string) => void;
}

const TaskTree: React.FC<TaskTreeProps> = ({
  tasks,
  onTaskUpdate,
  onTaskMove,
  onTaskCreate
}) => {
  return (
    <div className="task-tree">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-tree">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {renderTaskNodes(tasks)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
```

### 3. Gantt Chart Component
**Purpose**: Visual timeline representation of tasks and dependencies

**Visual Specifications**:
- Horizontal timeline with scalable zoom (days, weeks, months)
- Task bars showing duration and progress
- Dependency arrows between related tasks
- Critical path highlighting
- Today marker line

**Component Structure**:
```tsx
interface GanttChartProps {
  tasks: Task[];
  timeRange: { start: Date; end: Date };
  viewMode: 'days' | 'weeks' | 'months';
  onTaskResize: (taskId: string, newDates: { start: Date; end: Date }) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  timeRange,
  viewMode,
  onTaskResize
}) => {
  return (
    <div className="gantt-chart">
      <GanttHeader timeRange={timeRange} viewMode={viewMode} />
      <GanttBody 
        tasks={tasks}
        onTaskResize={onTaskResize}
      />
    </div>
  );
};
```

### 4. Task Detail Modal
**Purpose**: Comprehensive task editing interface

**Visual Specifications**:
- Large modal overlay (max-width: 800px)
- Tabbed interface (Details, Schedule, Attachments, Comments)
- Form fields with proper validation
- Save/Cancel actions clearly visible

**Component Structure**:
```tsx
interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <ModalHeader>
        <h2>Task Details</h2>
        <CloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <TaskDetailTabs task={task} onSave={onSave} />
      </ModalBody>
    </Modal>
  );
};
```

### 5. Schedule Adjustment Alert
**Purpose**: Notify users about automatic schedule changes

**Visual Specifications**:
- Toast notification or inline alert
- Clear description of what changed
- Undo action available for 10 seconds
- Animation to draw attention

**Component Structure**:
```tsx
interface ScheduleAlertProps {
  adjustment: {
    parentTask: string;
    affectedTasks: Array<{ id: string; oldDate: Date; newDate: Date }>;
    reason: string;
  };
  onUndo: () => void;
  onDismiss: () => void;
}

const ScheduleAlert: React.FC<ScheduleAlertProps> = ({
  adjustment,
  onUndo,
  onDismiss
}) => {
  return (
    <Alert severity="info" action={
      <div className="alert-actions">
        <Button onClick={onUndo} size="small">Undo</Button>
        <IconButton onClick={onDismiss}>×</IconButton>
      </div>
    }>
      <AlertTitle>Schedule Automatically Adjusted</AlertTitle>
      {adjustment.reason}
    </Alert>
  );
};
```

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements accessible via Tab/Shift+Tab
- Arrow keys for tree navigation
- Enter/Space for activation
- Escape to close modals/menus

### Screen Reader Support
- Proper ARIA labels and roles
- Live regions for dynamic content updates
- Descriptive text for complex interactions
- Meaningful heading hierarchy

### Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 for large text and UI components
- No color-only information conveyance
- High contrast mode support

## Animation and Interaction

### Micro-interactions
- Smooth hover states (200ms transition)
- Loading spinners for async operations
- Success/error feedback animations
- Drag preview during task reordering

### Page Transitions
- Route transitions with loading states
- Skeleton screens for content loading
- Progressive disclosure for complex forms
- Smooth modal appearance/disappearance

## Mobile Responsiveness

### Breakpoint Behavior
- **Mobile (< 768px)**: Single column layout, collapsible sidebar
- **Tablet (768px - 1024px)**: Two column layout, floating action buttons
- **Desktop (> 1024px)**: Full three column layout with sidebars

### Touch Interactions
- Minimum 44px touch targets
- Swipe gestures for navigation
- Pull-to-refresh on lists
- Long press for context menus

## Performance Considerations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy libraries

### Virtualization
- Virtual scrolling for large task lists
- Windowing for gantt chart rendering
- Pagination for data-heavy views

### Caching Strategy
- Service worker for offline capability
- Local storage for user preferences
- Session storage for form data
- React Query for server state caching
