import React from 'react';
import { Header } from './Header';
import { CircularCalendar } from '../calendar';

export const CalendarSection = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="relative w-full max-w-[90vh] aspect-square">
            {/* Space background with nebula effect */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.4) saturate(1.5)',
                transform: 'scale(1.02)', // Slight scale for blur margin
              }}
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
            </div>

            {/* Calendar container with glassmorphism */}
            <div className="relative glassmorphism rounded-2xl p-8 h-full flex items-center justify-center border border-white/10">
              <div className="animate-float w-full h-full flex items-center justify-center">
                <CircularCalendar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};