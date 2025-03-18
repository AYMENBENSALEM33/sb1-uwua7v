import React, { useMemo } from 'react';
import temperatureData from '../data/temperatures.json';

interface TemperatureGraphProps {
  radius: number;
  centerX: number;
  centerY: number;
  scale: number;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ radius, centerX, centerY, scale }) => {
  const maxTemp = Math.max(...temperatureData.temperatures.map(t => t.temp));
  const minTemp = Math.min(...temperatureData.temperatures.map(t => t.temp));
  const tempRange = maxTemp - minTemp;

  const points = useMemo(() => {
    return temperatureData.temperatures.map((temp, index) => {
      const angle = (index * 2 * Math.PI) / 12 - Math.PI / 2;
      const normalizedTemp = (temp.temp - minTemp) / tempRange;
      const pointRadius = radius * 0.4 * normalizedTemp;
      
      return {
        x: centerX + pointRadius * Math.cos(angle),
        y: centerY + pointRadius * Math.sin(angle),
        temp: temp.temp,
        month: new Date(2025, temp.month, 1).toLocaleString('fr-FR', { month: 'short' })
      };
    });
  }, [radius, centerX, centerY, minTemp, tempRange]);

  const pathData = points.map((point, index) => 
    (index === 0 ? 'M' : 'L') + `${point.x},${point.y}`
  ).join(' ') + 'Z';

  return (
    <g className="temperature-graph">
      {/* Cercles de référence */}
      {[0.25, 0.5, 0.75, 1].map((factor, index) => (
        <circle
          key={index}
          cx={centerX}
          cy={centerY}
          r={radius * 0.4 * factor}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      ))}

      {/* Courbe de température */}
      <path
        d={pathData}
        fill="rgba(239, 68, 68, 0.2)"
        stroke="#EF4444"
        strokeWidth="2"
      />

      {/* Points et labels */}
      {points.map((point, index) => (
        <g key={index}>
          <circle
            cx={point.x}
            cy={point.y}
            r={4}
            fill="#EF4444"
          />
          <text
            x={point.x}
            y={point.y - 10}
            textAnchor="middle"
            fill="#374151"
            fontSize={`${10 * scale}px`}
            className="temperature-label"
          >
            {`${point.temp}°C`}
          </text>
        </g>
      ))}
    </g>
  );
};

export default TemperatureGraph;