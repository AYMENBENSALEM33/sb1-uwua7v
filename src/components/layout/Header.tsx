import React from 'react';
import { Calendar, Settings } from 'lucide-react';

export const Header = () => {
  return (
    <header className="glassmorphism h-16 border-b border-white/10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="w-8 h-8 text-violet-400 animate-glow" />
          <h1 className="text-2xl neon-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Temporal Nexus
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5 text-violet-400" />
          </button>
        </div>
      </div>
    </header>
  );
};