import { useRef, useCallback, useState } from 'react';
import { Arc } from '../types';
import { useLogging } from '../../../hooks/useLogging';

interface CanvasState {
  events: any[];
  selectedArc: Arc | null;
  isDirty: boolean;
}

export function useCanvasState(initialEvents: any[]) {
  const logger = useLogging('CanvasState');
  const stateRef = useRef<CanvasState>({
    events: initialEvents,
    selectedArc: null,
    isDirty: true
  });
  
  // Trigger re-renders when needed
  const [updateCounter, setUpdateCounter] = useState(0);

  const forceUpdate = useCallback(() => {
    setUpdateCounter(prev => prev + 1);
  }, []);

  const updateEvents = useCallback((newEvents: any[]) => {
    stateRef.current.events = newEvents;
    stateRef.current.isDirty = true;
    forceUpdate();
    logger.info('Canvas events updated');
  }, [forceUpdate, logger]);

  const updateSelectedArc = useCallback((arc: Arc | null) => {
    stateRef.current.selectedArc = arc;
    stateRef.current.isDirty = true;
    forceUpdate();
    logger.info('Selected arc updated');
  }, [forceUpdate, logger]);

  const clearDirtyFlag = useCallback(() => {
    stateRef.current.isDirty = false;
  }, []);

  return {
    state: stateRef.current,
    updateEvents,
    updateSelectedArc,
    clearDirtyFlag
  };
}