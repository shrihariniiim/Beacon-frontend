import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-150 ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
