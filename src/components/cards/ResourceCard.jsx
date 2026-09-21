import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookmarkService } from '../../services/bookmarkService';
import { Badge } from '../common/Badge';
import { Bookmark, ShieldCheck, MapPin, Flag, ExternalLink } from 'lucide-react';

export const ResourceCard = ({
  resource,
  initialBookmarked = false,
  onBookmarkToggle,
  onReport
}) => {
  const { isParent, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !isParent) {
      error('Please log in as a parent to save bookmarks');
      return;
    }

    setLoadingBookmark(true);
    try {
      if (bookmarked) {
        await bookmarkService.removeBookmark(resource._id);
        setBookmarked(false);
        success('Resource removed from bookmarks');
        if (onBookmarkToggle) onBookmarkToggle(resource._id, false);
      } else {
        await bookmarkService.addBookmark(resource._id);
        setBookmarked(true);
        success('Resource saved to bookmarks');
        if (onBookmarkToggle) onBookmarkToggle(resource._id, true);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setLoadingBookmark(false);
    }
  };

  const org = resource.organizationId || {};
  const isGov = org.type === 'GOVERNMENT';
  const isVerified = resource.verificationStatus === 'VERIFIED';

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="category" size="sm">
              {resource.category?.replace(/_/g, ' ')}
            </Badge>

            {isGov ? (
              <Badge variant="government" size="sm" icon>
                Official Govt Program
              </Badge>
            ) : isVerified ? (
              <Badge variant="verified" size="sm" icon>
                Verified Resource
              </Badge>
            ) : (
              <Badge variant="pending" size="sm">
                Under Review
              </Badge>
            )}
          </div>

          {/* Bookmark Button for Parents */}
          {isAuthenticated && isParent && (
            <button
              type="button"
              onClick={handleToggleBookmark}
              disabled={loadingBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
              className={`p-1.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                bookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2 leading-snug">
          <Link to={`/resources/${resource._id}`} className="focus:outline-none focus:underline">
            {resource.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {resource.description}
        </p>

        {/* Sensory Tags */}
        {resource.sensoryTags && resource.sensoryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.sensoryTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200 rounded-md"
              >
                #{tag.replace(/_/g, ' ').toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="truncate max-w-[200px]">
          <span className="font-medium text-slate-700 truncate block">
            {org.name || 'Verified Partner'}
          </span>
          <span className="text-[11px] text-slate-400">
            {resource.location?.city ? `${resource.location.city}, ${resource.location.state}` : 'Virtual / National'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onReport && isAuthenticated && (
            <button
              type="button"
              onClick={() => onReport('RESOURCE', resource._id, resource.title)}
              aria-label={`Report resource ${resource.title}`}
              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <Flag className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          <Link
            to={`/resources/${resource._id}`}
            className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 focus:outline-none focus:underline"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
