import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceService } from '../../services/resourceService';
import { bookmarkService } from '../../services/bookmarkService';
import { useAuth } from '../../context/AuthContext';
import { ResourceCard } from '../../components/cards/ResourceCard';
import { ReportModal } from '../../components/modals/ReportModal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, Filter, RotateCcw, BookOpen } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'EDUCATIONAL', label: 'Educational Toolkits' },
  { value: 'THERAPY_SUPPORT', label: 'Therapy & AAC Support' },
  { value: 'GOVERNMENT_SCHEME', label: 'Government Welfare Schemes' },
  { value: 'ACCESSIBILITY', label: 'Accessibility & Mobility' },
  { value: 'COMMUNITY', label: 'Community & Peer Support' },
  { value: 'PARENT_SUPPORT', label: 'Caregiver Mental Health & Respite' },
  { value: 'TOOLKIT', label: 'Practical Home Toolkits' },
  { value: 'EMERGENCY_HELPLINE', label: 'Emergency & Crisis Helplines' }
];

const AGE_GROUPS = [
  { value: '', label: 'All Age Groups' },
  { value: 'INFANT', label: 'Infants (0-1 yr)' },
  { value: 'TODDLER', label: 'Toddlers (1-3 yrs)' },
  { value: 'PRE_SCHOOL', label: 'Preschool (3-5 yrs)' },
  { value: 'SCHOOL_AGE', label: 'School Age (6-12 yrs)' },
  { value: 'TEEN', label: 'Teens (13-17 yrs)' },
  { value: 'YOUNG_ADULT', label: 'Young Adults (18+)' }
];

const SENSORY_TAGS = [
  { value: '', label: 'All Sensory Tags' },
  { value: 'NOISE_SENSITIVE', label: 'Noise Sensitivity / Quiet' },
  { value: 'LIGHT_SENSITIVE', label: 'Light Sensitivity / Low Glare' },
  { value: 'TACTILE_SENSITIVE', label: 'Tactile Sensitivity' },
  { value: 'CALM_SPACE_NEEDED', label: 'Calm Respite Room Needed' },
  { value: 'SENSORY_SEEKING', label: 'Sensory Seeking & High Movement' }
];

export const ResourceDiscovery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isParent } = useAuth();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 350);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [ageGroup, setAgeGroup] = useState(searchParams.get('ageGroup') || '');
  const [sensoryTag, setSensoryTag] = useState(searchParams.get('sensoryTag') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [userBookmarks, setUserBookmarks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Report Modal State
  const [reportTarget, setReportTarget] = useState(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceService.getResources({
        search: debouncedSearch,
        category: category || undefined,
        ageGroup: ageGroup || undefined,
        sensoryTag: sensoryTag || undefined,
        page,
        limit: 8,
        verifiedOnly: true
      });

      setResources(res.data || []);
      if (res.meta) {
        setPagination({
          total: res.meta.total,
          totalPages: res.meta.totalPages
        });
      }

      // Fetch user's bookmarks if authenticated parent
      if (isAuthenticated && isParent) {
        try {
          const bRes = await bookmarkService.getBookmarks({ limit: 100 });
          const bookmarkedIds = new Set((bRes.data || []).map((b) => b.resourceId?._id));
          setUserBookmarks(bookmarkedIds);
        } catch {
          // Non-critical: continue without bookmarks map
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, ageGroup, sensoryTag, page, isAuthenticated, isParent]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleResetFilters = () => {
    setSearchInput('');
    setCategory('');
    setAgeGroup('');
    setSensoryTag('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verified Caregiver & Educational Resources
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Search and filter verified toolkits, evidence-based therapy guides, and official government assistance directories.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Debounced Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder="Search by keyword, topic, diagnosis, or skill..."
              aria-label="Search resources"
              className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
            <Select
              id="category-filter"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              options={CATEGORIES}
              aria-label="Filter by category"
            />

            <Select
              id="age-filter"
              value={ageGroup}
              onChange={(e) => {
                setAgeGroup(e.target.value);
                setPage(1);
              }}
              options={AGE_GROUPS}
              aria-label="Filter by age group"
            />

            <Select
              id="sensory-filter"
              value={sensoryTag}
              onChange={(e) => {
                setSensoryTag(e.target.value);
                setPage(1);
              }}
              options={SENSORY_TAGS}
              aria-label="Filter by sensory sensitivity"
            />
          </div>
        </div>

        {/* Status & Active Filter Count */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{resources.length}</strong> of{' '}
            <strong className="text-slate-800">{pagination.total}</strong> verified resources
          </div>

          {(searchInput || category || ageGroup || sensoryTag) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold focus:outline-none focus:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Results Grid */}
      {loading ? (
        <LoadingState message="Searching verified resources..." count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchResources} />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No verified resources match your criteria"
          description="Try broadening your search term or resetting the selected filters."
          icon={BookOpen}
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <ResourceCard
                key={res._id}
                resource={res}
                initialBookmarked={userBookmarks.has(res._id)}
                onReport={(type, id, title) => setReportTarget({ type, id, title })}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          contentType={reportTarget.type}
          contentId={reportTarget.id}
          contentTitle={reportTarget.title}
        />
      )}
    </div>
  );
};
