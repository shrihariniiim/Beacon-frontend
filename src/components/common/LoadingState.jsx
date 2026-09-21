import React from 'react';

export const LoadingState = ({ message = 'Loading content...', count = 3 }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full space-y-4 py-6"
    >
      <span className="sr-only">{message}</span>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-32 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
            <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
