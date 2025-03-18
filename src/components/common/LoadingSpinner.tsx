import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-violet-400 animate-bounce" />
      <div className="w-4 h-4 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-4 h-4 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  );
};