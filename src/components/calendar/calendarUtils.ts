import { Point } from './types';
import { Event } from '../../models/Event';

const DRAG_THRESHOLD = 20;

export function getCanvasCoordinates(e: React.MouseEvent<HTMLCanvasElement>): Point {
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

export function findEventAtPosition(x: number, y: number, events: Event[]): Event | null {
  const event = events.find(event => isPointInEventBounds(x, y, event));
  return event || null;
}

function isPointInEventBounds(x: number, y: number, event: Event): boolean {
  // Simple bounding box check - can be enhanced for more precise hit detection
  const bounds = getEventBounds(event);
  return (
    x >= bounds.x - DRAG_THRESHOLD &&
    x <= bounds.x + bounds.width + DRAG_THRESHOLD &&
    y >= bounds.y - DRAG_THRESHOLD &&
    y <= bounds.y + bounds.height + DRAG_THRESHOLD
  );
}

function getEventBounds(event: Event): { x: number; y: number; width: number; height: number } {
  // Calculate event bounds based on its position and dates
  // This is a simplified version - enhance based on your needs
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 30
  };
}

export function updateCursor(canvas: HTMLCanvasElement, event: Event | null): void {
  canvas.style.cursor = event ? 'pointer' : 'default';
  if (event) {
    canvas.title = formatEventTooltip(event);
  } else {
    canvas.removeAttribute('title');
  }
}

function formatEventTooltip(event: Event): string {
  return `${event.name}
Du ${formatDate(event.startDate)} au ${formatDate(event.endDate)}${
    event.value !== 0 ? `\nValeur: ${event.value > 0 ? '+' : ''}${event.value.toFixed(2)}` : ''
  }`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR');
}