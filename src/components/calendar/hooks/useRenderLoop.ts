import { useEffect, useRef, useCallback } from 'react';
import { CalendarRenderer } from '../CalendarRenderer';
import { Arc } from '../types';
import { useLogging } from '../../../hooks/useLogging';

interface RenderLoopProps {
  renderer: CalendarRenderer | null;
  events: any[];
  selectedArc: Arc | null;
  config: any;
}

export function useRenderLoop({ renderer, events, selectedArc, config }: RenderLoopProps) {
  const frameRef = useRef<number>();
  const isActiveRef = useRef(true);
  const logger = useLogging('RenderLoop');
  
  // Store latest props in refs to avoid stale closures
  const propsRef = useRef({ events, selectedArc, config });
  
  // Update ref values without triggering re-renders
  useEffect(() => {
    propsRef.current = { events, selectedArc, config };
  }, [events, selectedArc, config]);

  // Single render function that doesn't trigger state updates
  const renderFrame = useCallback(() => {
    if (!isActiveRef.current || !renderer) return;
    
    try {
      renderer.render(propsRef.current.events, propsRef.current.selectedArc);
    } catch (error) {
      logger.error('Render failed:', error);
      isActiveRef.current = false;
    }
  }, [renderer, logger]);

  // Setup render loop
  useEffect(() => {
    if (!renderer) return;

    isActiveRef.current = true;
    let animationFrameId: number;

    const animate = () => {
      if (!isActiveRef.current) return;
      renderFrame();
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isActiveRef.current = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [renderer, renderFrame]);
}