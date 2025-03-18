import { Arc } from './types';

export const drawArc = (
  ctx: CanvasRenderingContext2D, 
  arc: Arc, 
  centerX: number,
  centerY: number,
  zoom: number,
  isSelected: boolean = false
) => {
  ctx.beginPath();
  ctx.arc(centerX, centerY, arc.radius, arc.startAngle, arc.endAngle);
  ctx.strokeStyle = arc.color;
  ctx.lineWidth = isSelected ? 6 : 4;
  ctx.stroke();

  if (arc.value !== 0) {
    const midAngle = (arc.startAngle + arc.endAngle) / 2;
    const textRadius = arc.radius;
    const textX = centerX + textRadius * Math.cos(midAngle);
    const textY = centerY + textRadius * Math.sin(midAngle);

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.fillStyle = arc.value > 0 ? '#059669' : '#DC2626';
    ctx.font = `bold ${12 * zoom}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(arc.value.toFixed(2), 0, 0);
    ctx.restore();
  }
};