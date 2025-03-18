import React from 'react';
import { getSeasonColor } from '../../../utils/dateUtils';
import { GridSectorProps } from './types';

export const GridSector: React.FC<GridSectorProps> = ({
  sector,
  centerX,
  centerY,
  radius
}) => {
  const x1 = centerX + radius * Math.cos(sector.startAngle);
  const y1 = centerY + radius * Math.sin(sector.startAngle);
  const x2 = centerX + radius * Math.cos(sector.endAngle);
  const y2 = centerY + radius * Math.sin(sector.endAngle);

  return (
    <path
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
};