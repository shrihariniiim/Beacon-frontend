import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Calendar, Clock, MapPin, ExternalLink, Flag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EventCard = ({ event, onReport }) => {
  const { isAuthenticated } = useAuth();
  const org = event.organizationId || {};

  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date TBD';

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge variant={event.status === 'VERIFIED' ? 'verified' : 'pending'} size="sm" icon>
            {event.status === 'VERIFIED' ? 'Verified Event' : 'Review Pending'}
          </Badge>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {formattedDate}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2 leading-snug">
          <Link to={`/events/${event._id}`} className="focus:outline-none focus:underline">
            {event.title}
          </Link>
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Sensory Accommodations */}
        {event.sensoryAccommodations && event.sensoryAccommodations.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Sensory Accommodations:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {event.sensoryAccommodations.map((acc) => (
                <span
                  key={acc}
                  className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md"
                >
                  ✓ {acc.replace(/_/g, ' ').toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">
            {event.location?.isVirtual
              ? 'Virtual / Online Webinar'
              : `${event.location?.city || ''} ${event.location?.venueName ? `• ${event.location.venueName}` : ''}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onReport && isAuthenticated && (
            <button
              type="button"
              onClick={() => onReport('EVENT', event._id, event.title)}
              aria-label={`Report event ${event.title}`}
              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <Flag className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          <Link
            to={`/events/${event._id}`}
            className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 focus:outline-none focus:underline"
          >
            Register / Info &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
