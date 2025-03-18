import React from 'react';
import { MonthLabelProps } from './types';

export const MonthLabel: React.FC<MonthLabelProps> = ({
  sector,
  centerX,
  centerY,
  radius,
  scale
}) => {
  const x = centerX + radius * Math.cos(sector.startAngle);
  const y = centerY + radius * Math.sin(sector.startAngle);

  return (
    <g>
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
        {sector.date.toLocaleString('default', { month: 'short' })}
      </text>
    </g>
  );
};