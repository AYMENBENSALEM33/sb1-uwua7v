import React from 'react';
import { EventsHeader } from '../events/EventsHeader';
import { PlannedEvents } from '../events/PlannedEvents';
import { BacklogEvents } from '../events/BacklogEvents';

export const EventsSidebar = () => {
  return (
    <aside className="w-[35%] h-screen overflow-hidden glassmorphism border-r border-white/10 flex flex-col">
      <div className="p-4">
        <EventsHeader />
      </div>
      
      <div className="flex-1 grid grid-rows-2 gap-4 p-4 pt-0">
        {/* Planned Events Section */}
        <div className="overflow-hidden flex flex-col">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Planned Events</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <PlannedEvents />
          </div>
        </div>

        {/* Backlog Section */}
        <div className="overflow-hidden flex flex-col">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Backlog</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <BacklogEvents />
          </div>
        </div>
      </div>
    </aside>
  );
};