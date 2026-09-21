import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-600 max-w-sm mb-6">
        The requested page does not exist or may have been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={Home}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};
