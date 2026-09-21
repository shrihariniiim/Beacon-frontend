import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, AlertCircle, Sparkles } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-1.5'
  }[size] || 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    verified: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
    government: 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold',
    ngo: 'bg-teal-50 text-teal-800 border border-teal-200',
    pending: 'bg-amber-50 text-amber-800 border border-amber-300',
    rejected: 'bg-rose-50 text-rose-800 border border-rose-200',
    suspended: 'bg-red-100 text-red-900 border border-red-300',
    expired: 'bg-slate-200 text-slate-700 border border-slate-300',
    sensory: 'bg-teal-100 text-teal-900 border border-teal-300',
    category: 'bg-sky-50 text-sky-800 border border-sky-200'
  }[variant] || 'bg-slate-100 text-slate-700';

  const renderIcon = () => {
    if (!icon) return null;
    if (variant === 'verified') return <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />;
    if (variant === 'government') return <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" aria-hidden="true" />;
    if (variant === 'pending') return <Clock className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />;
    if (variant === 'rejected' || variant === 'suspended') return <AlertCircle className="w-3.5 h-3.5 text-rose-700" aria-hidden="true" />;
    if (variant === 'sensory') return <Sparkles className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />;
    return null;
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeStyles} ${variantStyles} ${className}`}
    >
      {renderIcon()}
      {children}
    </span>
  );
};
