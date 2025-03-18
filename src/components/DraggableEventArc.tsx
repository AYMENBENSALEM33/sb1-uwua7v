import React, { useState } from 'react';
import { useDrag } from '@use-gesture/react';

interface DraggableEventArcProps {
  path: string;
  color: string;
  name: string;
  startDate: string;
  endDate: string;
  value: number;
  onDrag: (dx: number, dy: number) => void;
}

const DraggableEventArc: React.FC<DraggableEventArcProps> = ({
  path,
  color,
  name,
  startDate,
  endDate,
  value,
  onDrag
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const bind = useDrag(({ movement: [dx, dy], first, last }) => {
    if (first) setIsDragging(true);
    if (last) setIsDragging(false);
    onDrag(dx, dy);
  });

  const tooltipContent = `${name}
Du ${startDate} au ${endDate}${value !== 0 ? `
Valeur: ${value > 0 ? '+' : ''}${value.toFixed(2)}` : ''}`;

  return (
    <g {...bind()} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
      <path
        d={path}
        stroke={color}
        strokeWidth="8"
        fill="none"
        className={`transition-colors ${isDragging ? 'stroke-opacity-50' : 'hover:stroke-opacity-80'}`}
      >
        <title>{tooltipContent}</title>
      </path>
    </g>
  );
};

export default DraggableEventArc;