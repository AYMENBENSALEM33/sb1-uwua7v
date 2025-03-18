import React from 'react';
import { useCalendarZoom } from '../hooks/useCalendarZoom';
import { CalendarControls } from '../presentational';

const ZoomControlContainer: React.FC = () => {
  const { zoom, handleZoomIn, handleZoomOut } = useCalendarZoom();

  return (
    <CalendarControls
      zoom={zoom}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
    />
  );
};

export default ZoomControlContainer;