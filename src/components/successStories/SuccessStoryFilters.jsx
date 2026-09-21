import React from 'react';
import { SUCCESS_STORY_CATEGORIES } from '../../data/successStories';

export const SuccessStoryFilters = ({ selectedCategory, onSelectCategory, countsByCategory = {} }) => {
  return (
    <nav aria-label="Success story categories" className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-thin">
        {SUCCESS_STORY_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = countsByCategory[category];

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              aria-pressed={isSelected}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm ring-1 ring-teal-700'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>{category}</span>
              {typeof count === 'number' && (
                <span 
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-teal-800 text-teal-100' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
