import React from 'react';
import { Event } from '../../../models/Event';
import { getDayOfYear } from '../../../utils/dateUtils';

interface EventArcsProps {
  events: Event[];
  centerX: number;
  centerY: number;
  radius: number;
  scale: number;
}

export const EventArcs: React.FC<EventArcsProps> = ({
  events,
  centerX,
  centerY,
  radius,
  scale
}) => {
  const calculateArc = (event: Event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const startDayOfYear = getDayOfYear(startDate);
    const endDayOfYear = getDayOfYear(endDate);
    
    const startAngle = (startDayOfYear * 2 * Math.PI) / 365 - Math.PI / 2;
    const endAngle = (endDayOfYear * 2 * Math.PI) / 365 - Math.PI / 2;
    const eventRadius = radius + (event.position - 1) * 20 * scale;

    return {
      path: `
        M ${centerX + eventRadius * Math.cos(startAngle)} ${centerY + eventRadius * Math.sin(startAngle)}
        A ${eventRadius} ${eventRadius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 1 
        ${centerX + eventRadius * Math.cos(endAngle)} ${centerY + eventRadius * Math.sin(endAngle)}
      `,
      labelAngle: (startAngle + endAngle) / 2,
      labelRadius: eventRadius
    };
  };

  return (
    <g className="event-arcs">
      {events.filter(e => e.visible).map(event => {
        const arc = calculateArc(event);
        
        return (
          <g key={event.id} className="event-arc">
            <path
              d={arc.path}
              stroke={event.color}
              strokeWidth="4"
              fill="none"
              className="transition-all duration-300 hover:filter hover:brightness-125"
              filter="url(#glow)"
            >
              <title>{`${event.name}\n${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`}</title>
            </path>
            
            {event.value !== 0 && (
              <text
                x={centerX + arc.labelRadius * Math.cos(arc.labelAngle)}
                y={centerY + arc.labelRadius * Math.sin(arc.labelAngle)}
                fill={event.value > 0 ? '#10B981' : '#EF4444'}
                fontSize={`${12 * scale}px`}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${
                  (arc.labelAngle * 180) / Math.PI + 90
                }, ${centerX + arc.labelRadius * Math.cos(arc.labelAngle)}, ${
                  centerY + arc.labelRadius * Math.sin(arc.labelAngle)
                })`}
                className="event-value"
              >
                {event.value > 0 ? '+' : ''}{event.value.toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};