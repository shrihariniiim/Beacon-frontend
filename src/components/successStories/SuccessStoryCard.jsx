import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, User } from 'lucide-react';

export const SuccessStoryCard = ({ story }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article 
      className="group bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full overflow-hidden motion-safe:hover:-translate-y-1"
    >
      {/* Person Portrait */}
      <div className="relative aspect-[16/11] w-full bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={story.image}
            alt={story.imageAlt}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-teal-50 text-teal-700 p-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-teal-600" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-center text-teal-900">{story.name}</span>
          </div>
        )}
        
        {/* Subtle primary category tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs border border-white/60">
            {story.primaryCategory}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            <Link 
              to={`/success-stories/${story.id}`}
              className="focus:outline-none focus:underline"
            >
              {story.name}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-teal-700 mt-0.5">
            {story.field}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
            {story.shortDescription}
          </p>

          {/* Authentic Verified Quote Box (Matching Reference Layout) */}
          {story.quote && (
            <div className="mt-3.5 bg-teal-50/70 border border-teal-100/80 rounded-lg p-3 relative">
              <div className="flex gap-2">
                <Quote className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5 fill-teal-500/20" aria-hidden="true" />
                <p className="text-xs font-medium text-teal-950 italic leading-relaxed">
                  “{story.quote}”
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Action Link */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end">
          <Link
            to={`/success-stories/${story.id}`}
            aria-label={`Read full story of ${story.name}`}
            className="group/link inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 rounded-sm px-1 py-0.5"
          >
            <span>Read Story</span>
            <ArrowRight 
              className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform motion-safe:duration-150" 
              aria-hidden="true" 
            />
          </Link>
        </div>
      </div>
    </article>
  );
};
