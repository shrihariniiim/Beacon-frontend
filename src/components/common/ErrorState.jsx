import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Failed to load content',
  message = 'An error occurred while loading this information. Please check your connection and try again.',
  onRetry
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 border border-rose-200 rounded-2xl my-6"
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 max-w-md mb-5">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={RotateCcw}>
          Try Again
        </Button>
      )}
    </div>
  );
};
