export function formatEventTooltip(event: {
  name: string;
  startDate: string;
  endDate: string;
  value: number;
}): string {
  return `${event.name}
Du ${formatDate(event.startDate)} au ${formatDate(event.endDate)}${
    event.value !== 0 ? `\nValeur: ${event.value > 0 ? '+' : ''}${event.value.toFixed(2)}` : ''
  }`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export function updateCursor(canvas: HTMLCanvasElement, event: any | null): void {
  canvas.style.cursor = event ? 'pointer' : 'default';
  if (event) {
    canvas.title = formatEventTooltip(event);
  } else {
    canvas.removeAttribute('title');
  }
}