import React from 'react';
import { Search, Sparkles } from 'lucide-react';

export const SuccessStoryEmptyState = ({ onReset }) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
        <Search className="w-6 h-6" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        No stories found
      </h3>

      <p className="text-sm text-slate-600 mt-1 mb-6">
        Try another category to explore more journeys.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        <span>View All Stories</span>
      </button>
    </div>
  );
};
