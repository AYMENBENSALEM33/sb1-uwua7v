import React, { useCallback } from 'react';
import { CalendarControls } from './controls/CalendarControls';
import { CalendarGrid } from './grid/CalendarGrid';
import { EventArcs } from './events/EventArcs';
import { useEventStore } from '../../store/eventStore';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { create } from 'zustand';
import { createCalendarSlice, CalendarStore } from '../../store/slices/calendarSlice';

const useCalendarStore = create<CalendarStore>()((...args) => ({
  ...createCalendarSlice(...args)
}));

export const CircularCalendar: React.FC = () => {
  const { events } = useEventStore();
  const { createEventFromDates, isCreating, error } = useCalendarEvents();
  const { 
    scale, yearCount, startYear, baseRadius, yearSpacing,
    setScale, addYear, removeYear, setStartYear 
  } = useCalendarStore();

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });

  const getYearRadius = useCallback((yearOffset: number) => {
    return (baseRadius + yearOffset * yearSpacing) * scale;
  }, [baseRadius, yearSpacing, scale]);

  const getYearEvents = useCallback((year: number) => {
    return sortedEvents.filter(event => {
      const eventYear = new Date(event.startDate).getFullYear();
      return eventYear === year;
    });
  }, [sortedEvents]);

  // Calculate dimensions based on the largest radius needed
  const maxRadius = getYearRadius(yearCount - 1);
  const svgSize = (maxRadius + 100) * 2;

  return (
    <div className="flex flex-col items-center space-y-6 w-full h-full">
      <CalendarControls
        scale={scale}
        yearCount={yearCount}
        startYear={startYear}
        onScaleChange={setScale}
        onYearAdd={addYear}
        onYearRemove={removeYear}
        onStartYearChange={setStartYear}
      />

      <div className="relative flex-1 w-full flex items-center justify-center">
        <svg 
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="w-full h-full touch-none transform-gpu"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Center point for reference */}
          <circle 
            cx={svgSize / 2} 
            cy={svgSize / 2} 
            r="2" 
            fill="rgba(255,255,255,0.5)" 
          />

          {/* Render years in reverse order for proper layering */}
          {Array.from({ length: yearCount }).map((_, i) => {
            const yearIndex = yearCount - 1 - i;
            const year = startYear + yearIndex;
            const radius = getYearRadius(yearIndex);

            return (
              <g key={year} className="year-band" style={{ isolation: 'isolate' }}>
                {/* Year circle */}
                <circle
                  cx={svgSize / 2}
                  cy={svgSize / 2}
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  className="year-circle"
                />

                {/* Calendar grid for this year */}
                <CalendarGrid
                  centerX={svgSize / 2}
                  centerY={svgSize / 2}
                  radius={radius}
                  scale={scale}
                  year={year}
                />

                {/* Event arcs for this year */}
                <EventArcs
                  events={getYearEvents(year)}
                  centerX={svgSize / 2}
                  centerY={svgSize / 2}
                  radius={radius}
                  scale={scale}
                />

                {/* Year label */}
                <text
                  x={svgSize / 2 + radius + 10}
                  y={svgSize / 2}
                  fill="rgba(255,255,255,0.6)"
                  fontSize={`${12 * scale}px`}
                  className="year-label"
                >
                  {year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};