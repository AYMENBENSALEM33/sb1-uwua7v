import React from 'react';
import { EventsSidebar } from './EventsSidebar';
import { CalendarSection } from './CalendarSection';
import { LogsSidebar } from './LogsSidebar';

export const MainLayout = () => {
  return (
    <div 
      className="min-h-screen bg-gray-900 text-gray-100"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2072')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen bg-black/60 backdrop-blur-sm flex">
        <EventsSidebar />
        <CalendarSection />
        <LogsSidebar />
      </div>
    </div>
  );
};