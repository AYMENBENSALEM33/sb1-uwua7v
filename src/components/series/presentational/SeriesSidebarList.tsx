import React, { useState } from 'react';
import { Series } from '../../../models/Series';
import { SeriesSidebarItem } from './SeriesSidebarItem';
import { generateComponentKey } from '../../../utils/idGenerator';

interface SeriesSidebarListProps {
  series: Series[];
  onAddEvent: (seriesId: number) => void;
}

export const SeriesSidebarList: React.FC<SeriesSidebarListProps> = ({
  series,
  onAddEvent
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (series.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No event series available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {series.map(item => (
        <SeriesSidebarItem
          key={generateComponentKey(`series-${item.id}`)}
          series={item}
          isExpanded={expandedId === item.id}
          onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
          onAddEvent={() => onAddEvent(item.id)}
        />
      ))}
    </div>
  );
};