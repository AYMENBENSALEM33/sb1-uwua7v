import React from 'react';
import { getSeasonColor } from '../../../utils/dateUtils';

interface CalendarGridProps {
  centerX: number;
  centerY: number;
  radius: number;
  scale: number;
  selectedDates?: {
    start: Date | null;
    end: Date | null;
  };
  onDayClick?: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  centerX,
  centerY,
  radius,
  scale,
  selectedDates,
  onDayClick
}) => {
  const sectors = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(2024, 0, index + 1);
    const angle = (index * 2 * Math.PI) / 365 - Math.PI / 2;
    const nextAngle = ((index + 1) * 2 * Math.PI) / 365 - Math.PI / 2;
    
    const isSelected = selectedDates?.start && selectedDates?.end 
      ? date >= selectedDates.start && date <= selectedDates.end
      : selectedDates?.start 
        ? date.getTime() === selectedDates.start.getTime()
        : false;
    
    return {
      date,
      startAngle: angle,
      endAngle: nextAngle,
      dayOfYear: index + 1,
      isFirstOfMonth: date.getDate() === 1,
      dayNumber: date.getDate(),
      isSelected
    };
  });

  return (
    <g className="calendar-grid">
      {sectors.map((sector, i) => {
        const x1 = centerX + radius * Math.cos(sector.startAngle);
        const y1 = centerY + radius * Math.sin(sector.startAngle);
        const x2 = centerX + radius * Math.cos(sector.endAngle);
        const y2 = centerY + radius * Math.sin(sector.endAngle);

        return (
          <g key={`sector-${i}`} className="sector-group">
            <path
              d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
              fill={sector.isSelected ? 'rgba(139, 92, 246, 0.3)' : getSeasonColor(sector.dayOfYear)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={sector.isFirstOfMonth ? "1" : "0.5"}
              className="transition-all duration-300 hover:filter hover:brightness-125 cursor-pointer"
              filter="url(#glow)"
              onClick={() => onDayClick?.(sector.date)}
            />
            
            {sector.isFirstOfMonth && (
              <>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x1}
                  y2={y1}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  className="month-line"
                />
                <text
                  x={centerX + (radius - 20) * Math.cos(sector.startAngle)}
                  y={centerY + (radius - 20) * Math.sin(sector.startAngle)}
                  fill="rgba(255,255,255,0.8)"
                  fontSize={`${10 * scale}px`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${
                    (sector.startAngle * 180) / Math.PI + 90
                  }, ${centerX + (radius - 20) * Math.cos(sector.startAngle)}, ${
                    centerY + (radius - 20) * Math.sin(sector.startAngle)
                  })`}
                  className="month-label"
                >
                  {sector.date.toLocaleString('default', { month: 'short' })}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
};