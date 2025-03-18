# Project Structure Documentation

## Overview

The project follows a modular, feature-based architecture with clear separation of concerns.

## Directory Structure

```
src/
├── components/              # React components organized by feature
│   ├── calendar/           # Calendar visualization module
│   │   ├── containers/     # Container components with business logic
│   │   ├── presentational/ # Pure UI components
│   │   ├── hooks/         # Calendar-specific hooks
│   │   ├── utils/         # Calendar-specific utilities
│   │   └── types/         # Type definitions
│   ├── series/            # Series management module
│   ├── logs/              # Logging and diagnostics module
│   └── common/            # Shared components
├── hooks/                  # Global custom hooks
├── store/                 # State management (Zustand)
├── services/              # Business logic and API services
├── utils/                 # Global utility functions
├── models/               # Shared TypeScript interfaces/types
└── db/                   # Database related code

## Key Modules

### Calendar Module
```
calendar/
├── containers/
│   ├── Game2DCalendarContainer.tsx    # Main calendar logic
│   ├── CalendarCanvasContainer.tsx    # Canvas rendering logic
│   ├── EventHandlerContainer.tsx      # Event handling
│   └── ZoomControlContainer.tsx       # Zoom controls
├── presentational/
│   ├── Game2DCalendar.tsx            # Main calendar UI
│   ├── CalendarCanvas.tsx            # Canvas rendering
│   └── CalendarControls.tsx          # Zoom controls UI
├── hooks/
│   ├── useCalendarEvents.ts          # Event handling
│   ├── useCalendarZoom.ts            # Zoom functionality
│   ├── useCalendarRenderer.ts        # Canvas rendering
│   └── useCalendarState.ts           # State management
├── utils/
│   ├── coordinates.ts                # Coordinate calculations
│   ├── grid.ts                       # Grid layout utilities
│   └── rendering.ts                  # Canvas drawing utilities
└── types/
    └── index.ts                      # Type definitions
```

### Store Layer
```
store/
├── calendarStore.ts                  # Calendar state
├── eventStore.ts                     # Event management
├── seriesStore.ts                    # Series management
└── syncLogsStore.ts                  # Sync logging
```

### Services Layer
```
services/
├── api/
│   ├── serviceDeskApi.ts            # API client
│   ├── logger.ts                    # Logging service
│   └── errorHandler.ts              # Error handling
├── sync/
│   ├── eventSyncService.ts          # Event sync
│   └── syncManager.ts               # Sync orchestration
└── cache/
    └── cacheService.ts              # Caching service
```

## Best Practices

1. Component Organization
   - Separate container (logic) and presentational (UI) components
   - Keep components small and focused
   - Use TypeScript for type safety

2. State Management
   - Use Zustand for global state
   - Keep state updates atomic
   - Optimize re-renders with memoization

3. Code Organization
   - Group related code by feature
   - Keep utilities close to where they're used
   - Clear and consistent naming

4. Performance
   - Memoize expensive calculations
   - Optimize canvas rendering
   - Batch state updates