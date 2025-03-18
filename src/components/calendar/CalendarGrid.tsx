import React from 'react';
import { getSeasonColor } from '../../utils/dateUtils';
import { CalendarGridProps } from './grid/types';

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  centerX,
  centerY,
  radius,
  scale
}) => {
  // Generate grid sectors for 365 days
  const sectors = Array.from({ length: 365 }, (_, index) => {
    const angle = (index * 2 * Math.PI) / 365 - Math.PI / 2;
    const nextAngle = ((index + 1) * 2 * Math.PI) / 365 - Math.PI / 2;
    const date = new Date(2024, 0, index + 1);
    
    return {
      startAngle: angle,
      endAngle: nextAngle,
      dayOfYear: index + 1,
      isFirstOfMonth: date.getDate() === 1,
      dayNumber: date.getDate()
    };
  });

  return (
    <g>
      {/* Grid sectors */}
      {sectors.map((sector, i) => {
        const x1 = centerX + radius * Math.cos(sector.startAngle);
        const y1 = centerY + radius * Math.sin(sector.startAngle);
        const x2 = centerX + radius * Math.cos(sector.endAngle);
        const y2 = centerY + radius * Math.sin(sector.endAngle);

        return (
          <path
            key={`sector-${i}`}
            d={`
              M ${centerX} ${centerY}
              L ${x1} ${y1}
              A ${radius} ${radius} 0 0 1 ${x2} ${y2}
              Z
            `}
            fill={getSeasonColor(sector.dayOfYear)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Month separators and labels */}
      {sectors.map((sector, i) => {
        if (sector.isFirstOfMonth) {
          const x = centerX + radius * Math.cos(sector.startAngle);
          const y = centerY + radius * Math.sin(sector.startAngle);
          
          return (
            <g key={`month-${i}`}>
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
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
              >
                {new Date(2024, 0, sector.dayOfYear).toLocaleString('default', { month: 'short' })}
              </text>
            </g>
          );
        }
        return null;
      })}
    </g>
  );
};

export default CalendarGrid;