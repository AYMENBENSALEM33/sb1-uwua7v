import React, { useMemo, useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { Minus, Plus, ThermometerSun } from 'lucide-react';
import TemperatureGraph from './TemperatureGraph';
import { getDayOfYear, getSeasonColor } from '../utils/dateUtils';
import DraggableEventArc from './DraggableEventArc';

const CircularCalendar: React.FC = () => {
  const { events, selectedDays, toggleDaySelection, updateEvent } = useEventStore();
  const [showTemperatures, setShowTemperatures] = useState(false);
  const [scale, setScale] = useState(1);
  const baseRadius = 200;
  const radius = baseRadius * scale;
  const centerX = radius + 50;
  const centerY = radius + 50;
  const totalDays = 365;
  const lineSpacing = 20;

  const daySectors = useMemo(() => {
    return Array.from({ length: totalDays }, (_, index) => {
      const angle = (index * 2 * Math.PI) / totalDays - Math.PI / 2;
      const nextAngle = ((index + 1) * 2 * Math.PI) / totalDays - Math.PI / 2;

      const date = new Date(2025, 0, index + 1);
      const isFirstOfMonth = date.getDate() === 1;

      const x1 = centerX + radius * Math.cos(angle);
      const y1 = centerY + radius * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(nextAngle);
      const y2 = centerY + radius * Math.sin(angle);

      const path = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 0 1 ${x2} ${y2}
        L ${centerX} ${centerY}
      `;

      const labelRadius = radius - 15;
      const labelX = centerX + labelRadius * Math.cos((angle + nextAngle) / 2);
      const labelY = centerY + labelRadius * Math.sin((angle + nextAngle) / 2);

      return {
        path,
        dayOfYear: index + 1,
        isFirstOfMonth,
        isToday: index + 1 === getDayOfYear(new Date()),
        isSelected: selectedDays.includes(index + 1),
        date: date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        dayNumber: date.getDate(),
        labelX,
        labelY,
        startAngle: angle,
        endAngle: nextAngle
      };
    });
  }, [radius, centerX, centerY, selectedDays]);

  const eventArcs = useMemo(() => {
    const sortedEvents = [...events]
      .filter(event => event.visible)
      .sort((a, b) => a.position - b.position);

    return sortedEvents.map(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      const startDayOfYear = getDayOfYear(startDate);
      const endDayOfYear = getDayOfYear(endDate);
      
      const isSingleDay = startDayOfYear === endDayOfYear;
      
      const eventRadius = radius + (event.position - 1) * lineSpacing;
      
      let path = '';
      
      if (isSingleDay) {
        const sector = daySectors[startDayOfYear - 1];
        if (!sector) return null;
        
        const startX = centerX + eventRadius * Math.cos(sector.startAngle);
        const startY = centerY + eventRadius * Math.sin(sector.startAngle);
        const endX = centerX + eventRadius * Math.cos(sector.endAngle);
        const endY = centerY + eventRadius * Math.sin(sector.endAngle);
        
        path = `M ${startX} ${startY} A ${eventRadius} ${eventRadius} 0 0 1 ${endX} ${endY}`;
      } else {
        const startAngle = (startDayOfYear * 2 * Math.PI) / totalDays - Math.PI / 2;
        const endAngle = (endDayOfYear * 2 * Math.PI) / totalDays - Math.PI / 2;
        
        const startX = centerX + eventRadius * Math.cos(startAngle);
        const startY = centerY + eventRadius * Math.sin(startAngle);
        const endX = centerX + eventRadius * Math.cos(endAngle);
        const endY = centerY + eventRadius * Math.sin(endAngle);
        
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        
        path = `M ${startX} ${startY} A ${eventRadius} ${eventRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
      }
      
      return {
        id: event.id,
        path,
        color: event.color,
        name: event.name,
        startDate: startDate.toLocaleDateString('fr-FR'),
        endDate: endDate.toLocaleDateString('fr-FR'),
        position: event.position
      };
    }).filter(Boolean);
  }, [events, radius, centerX, centerY, lineSpacing, daySectors]);

  const handleEventDrag = (eventId: number, dx: number, dy: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const sensitivity = 0.3;
    const newPosition = Math.max(1, Math.round(event.position + dy * sensitivity / lineSpacing));
    
    updateEvent(eventId, { position: newPosition });
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-8">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={scale}
          className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          onChange={(e) => setScale(Math.min(2, parseFloat(e.target.value)))}
        />
        
        <button
          onClick={() => setScale(Math.min(2, scale + 0.1))}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowTemperatures(!showTemperatures)}
          className={`p-2 rounded-full transition-colors ${
            showTemperatures 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'hover:bg-gray-100'
          }`}
        >
          <ThermometerSun className="w-5 h-5" />
        </button>
      </div>

      <svg 
        width={(radius + 100) * 2} 
        height={(radius + 100) * 2}
        className="touch-none"
      >
        {daySectors.map((sector) => (
          <g key={`day-${sector.dayOfYear}`}>
            <path
              d={sector.path}
              fill={
                sector.isToday 
                  ? "rgba(239, 68, 68, 0.5)" 
                  : sector.isSelected 
                    ? "rgba(99, 102, 241, 0.2)" 
                    : getSeasonColor(sector.dayOfYear)
              }
              stroke={sector.isFirstOfMonth ? "#9CA3AF" : "#E5E7EB"}
              strokeWidth={sector.isFirstOfMonth ? "0.5" : "0.2"}
              className="transition-all duration-300 cursor-pointer hover:fill-indigo-100"
              onClick={() => toggleDaySelection(sector.dayOfYear)}
            >
              <title>{sector.date}</title>
            </path>
            {(sector.isFirstOfMonth || sector.dayNumber % 5 === 0) && (
              <text
                x={sector.labelX}
                y={sector.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
                style={{ fontSize: `${8 * scale}px` }}
                transform={`rotate(${((sector.dayOfYear - 1) * 360) / totalDays}, ${sector.labelX}, ${sector.labelY})`}
              >
                {sector.dayNumber}
              </text>
            )}
          </g>
        ))}

        {eventArcs.map((arc, index) => (
          <DraggableEventArc
            key={index}
            path={arc.path}
            color={arc.color}
            name={arc.name}
            startDate={arc.startDate}
            endDate={arc.endDate}
            onDrag={(dx, dy) => handleEventDrag(arc.id, dx, dy)}
          />
        ))}

        {showTemperatures && (
          <TemperatureGraph
            radius={radius}
            centerX={centerX}
            centerY={centerY}
            scale={scale}
          />
        )}
      </svg>
    </div>
  );
};

export default CircularCalendar;