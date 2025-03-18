import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (startDate: Date, endDate: Date) => void;
  title?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Select Period"
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onSubmit(new Date(startDate), new Date(endDate));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-semibold neon-text">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 rounded-lg transition-colors"
            >
              Sync
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};