import React, { useState, useEffect } from 'react';
import { bookmarkService } from '../../services/bookmarkService';
import { ResourceCard } from '../../components/cards/ResourceCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Pagination } from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import { Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookmarksPage = () => {
  const { error } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setErrMessage(null);
    try {
      const res = await bookmarkService.getBookmarks({ page, limit: 8 });
      setBookmarks(res.data || []);
      if (res.meta) {
        setPagination({
          total: res.meta.total,
          totalPages: res.meta.totalPages
        });
      }
    } catch (err) {
      setErrMessage(err.response?.data?.message || 'Failed to load saved bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [page]);

  const handleBookmarkToggle = (resourceId, isBookmarked) => {
    if (!isBookmarked) {
      // Instantly remove from view
      setBookmarks((prev) => prev.filter((b) => b.resourceId?._id !== resourceId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Bookmark className="w-7 h-7 text-amber-500 fill-current" aria-hidden="true" />
          Saved Caregiver Resources
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Quickly access the educational toolkits, therapy schemes, and guides you have bookmarked.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading your bookmarks..." count={3} />
      ) : errMessage ? (
        <ErrorState message={errMessage} onRetry={fetchBookmarks} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          title="You haven't bookmarked any resources yet"
          description="Browse our verified directory and tap the bookmark icon on any guide or toolkit to save it here for fast offline reference."
          icon={Bookmark}
          actionLabel="Browse Resources"
          onAction={() => {}}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map((b) => (
              <ResourceCard
                key={b._id}
                resource={b.resourceId}
                initialBookmarked={true}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};
