import React, { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  id,
  name,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  children,
  ...props
}, ref) => {
  const selectId = id || name || Math.random().toString(36).substring(2, 9);
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-slate-700 mb-1"
        >
          {label}
          {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full px-3.5 py-2 text-sm text-slate-900 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors ${
          error
            ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
            : 'border-slate-300'
        } ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>

      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
