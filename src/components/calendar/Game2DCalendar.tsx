import React, { useCallback, useRef, useEffect } from 'react';
import { useSpring, useSprings, animated } from '@use-gesture/react';
import { useEventStore } from '../../store/eventStore';
import { useCalendarState } from './hooks/useCalendarState';
import CalendarControls from './CalendarControls';
import CalendarCanvas from './CalendarCanvas';
import { getCanvasCoordinates } from './utils/coordinates';

const FRICTION = 0.95; // Friction coefficient
const SPRING_TENSION = 180; // Spring tension for bounce effect
const SPRING_DAMPING = 12; // Spring damping for smooth movement

const Game2DCalendar: React.FC = () => {
  const { events } = useEventStore();
  const { config, updateZoom } = useCalendarState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Physics-based rotation animation
  const [{ rotation }, setRotation] = useSpring(() => ({
    rotation: 0,
    config: {
      tension: SPRING_TENSION,
      friction: FRICTION,
      damping: SPRING_DAMPING
    }
  }));

  // Event arc springs for elastic interactions
  const [eventSprings, setEventSprings] = useSprings(events.length, i => ({
    scale: 1,
    y: 0,
    config: {
      tension: 400,
      friction: 20
    }
  }));

  // Handle mouse wheel for smooth zooming
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    updateZoom(delta);
  }, [updateZoom]);

  // Physics update loop
  useEffect(() => {
    let animationFrame: number;
    
    const updatePhysics = () => {
      if (!isMouseDownRef.current) {
        // Apply friction to rotation velocity
        velocityRef.current.x *= FRICTION;
        velocityRef.current.y *= FRICTION;

        // Update rotation based on velocity
        setRotation({
          rotation: rotation.get() + velocityRef.current.x,
          immediate: false
        });
      }

      animationFrame = requestAnimationFrame(updatePhysics);
    };

    animationFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrame);
  }, [rotation, setRotation]);

  // Mouse interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    const coords = getCanvasCoordinates(e);
    lastMousePosRef.current = coords;
    
    // Reset velocity when starting new interaction
    velocityRef.current = { x: 0, y: 0 };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDownRef.current) return;

    const coords = getCanvasCoordinates(e);
    const deltaX = coords.x - lastMousePosRef.current.x;
    const deltaY = coords.y - lastMousePosRef.current.y;

    // Update velocity based on mouse movement
    velocityRef.current = {
      x: deltaX * 0.1,
      y: deltaY * 0.1
    };

    // Update rotation with spring physics
    setRotation({
      rotation: rotation.get() + deltaX * 0.1,
      immediate: true
    });

    lastMousePosRef.current = coords;
  }, [rotation, setRotation]);

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
  }, []);

  // Event handlers for elastic event interactions
  const handleEventHover = useCallback((index: number) => {
    setEventSprings.start(i => {
      if (i === index) {
        return { scale: 1.1, y: -5 };
      }
      return { scale: 1, y: 0 };
    });
  }, [setEventSprings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <CalendarControls
        zoom={config.zoom}
        onZoomIn={useCallback(() => updateZoom(0.1), [updateZoom])}
        onZoomOut={useCallback(() => updateZoom(-0.1), [updateZoom])}
      />

      <animated.div
        style={{
          transform: rotation.to(r => `rotate(${r}deg)`)
        }}
      >
        <CalendarCanvas
          width={config.width}
          height={config.height}
          events={events}
          selectedArc={null}
          config={config}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={canvasRef}
        />
      </animated.div>
    </div>
  );
};

export default React.memo(Game2DCalendar);