const drawArc = (ctx: CanvasRenderingContext2D, arc: Arc, isSelected: boolean = false) => {
  ctx.beginPath();
  ctx.arc(CENTER_X, CENTER_Y, arc.radius, arc.startAngle, arc.endAngle);
  ctx.strokeStyle = arc.color;
  ctx.lineWidth = isSelected ? 6 : 4;
  ctx.stroke();

  if (arc.value !== 0) {
    const midAngle = (arc.startAngle + arc.endAngle) / 2;
    const textRadius = arc.radius;
    const textX = CENTER_X + textRadius * Math.cos(midAngle);
    const textY = CENTER_Y + textRadius * Math.sin(midAngle);

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