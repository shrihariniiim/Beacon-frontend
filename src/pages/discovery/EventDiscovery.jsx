import React, { useState, useEffect, useCallback } from 'react';
import { eventService } from '../../services/eventService';
import { EventCard } from '../../components/cards/EventCard';
import { ReportModal } from '../../components/modals/ReportModal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Select } from '../../components/common/Select';
import { Calendar, Search } from 'lucide-react';

const SENSORY_OPTIONS = [
  { value: '', label: 'All Sensory Accommodations' },
  { value: 'QUIET_ROOM_AVAILABLE', label: 'Quiet / Respite Room Available' },
  { value: 'WHEELCHAIR_ACCESS', label: 'Wheelchair Accessible' },
  { value: 'NOISE_CANCELING_HEADPHONES_PROVIDED', label: 'Noise Canceling Headphones' },
  { value: 'LOW_LIGHTING', label: 'Low / Soft Lighting' },
  { value: 'SIGN_LANGUAGE_INTERPRETER', label: 'Sign Language Interpreter' },
  { value: 'TRAINED_STAFF_ON_SITE', label: 'Trained Support Staff on Site' }
];

export const EventDiscovery = () => {
  const [cityInput, setCityInput] = useState('');
  const [sensoryFilter, setSensoryFilter] = useState('');
  const [page, setPage] = useState(1);

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reportTarget, setReportTarget] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEvents({
        city: cityInput || undefined,
        sensoryAccommodation: sensoryFilter || undefined,
        page,
        limit: 6,
        upcomingOnly: true
      });

      setEvents(res.data || []);
      if (res.meta) {
        setPagination({
          total: res.meta.total,
          totalPages: res.meta.totalPages
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load community events');
    } finally {
      setLoading(false);
    }
  }, [cityInput, sensoryFilter, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sensory-Friendly Community Events
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Discover inclusive workshops, sensory respite circles, and educational webinars verified for quiet spaces, low glare, and accessibility.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by city (e.g. Coimbatore, New Delhi)..."
            aria-label="Filter events by city"
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="w-full sm:w-72">
          <Select
            id="event-sensory-filter"
            value={sensoryFilter}
            onChange={(e) => {
              setSensoryFilter(e.target.value);
              setPage(1);
            }}
            options={SENSORY_OPTIONS}
            aria-label="Filter by sensory accommodations"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading upcoming verified events..." count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No upcoming events match this criteria"
          description="Try clearing your city or sensory filters to view all verified events across the network."
          icon={Calendar}
          actionLabel="Clear Filters"
          onAction={() => {
            setCityInput('');
            setSensoryFilter('');
            setPage(1);
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <EventCard
                key={ev._id}
                event={ev}
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
