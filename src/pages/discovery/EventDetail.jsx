import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ReportModal } from '../../components/modals/ReportModal';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Mail,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Flag
} from 'lucide-react';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setErrMessage(null);
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
      } catch (err) {
        setErrMessage(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading event details..." count={1} />
      </div>
    );
  }

  if (errMessage || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Event Unavailable"
          message={errMessage || 'This event was not found or has been concluded.'}
          onRetry={() => navigate('/events')}
        />
      </div>
    );
  }

  const org = event.organizationId || {};
  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date TBD';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 focus:outline-none focus:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Events
        </Link>
      </div>

      <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant={event.status === 'VERIFIED' ? 'verified' : 'pending'} size="md" icon>
            {event.status === 'VERIFIED' ? 'Verified Community Event' : 'Review Pending'}
          </Badge>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              aria-label="Report event"
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Flag className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 mt-3">
            <span className="flex items-center gap-1.5 text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 font-bold">
              <Calendar className="w-4 h-4 text-teal-700" aria-hidden="true" />
              {formattedDate}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-semibold">
                <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
                {event.time}
              </span>
            )}
          </div>
        </div>

        {/* Sensory Accommodations */}
        {event.sensoryAccommodations && event.sensoryAccommodations.length > 0 && (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Verified Sensory Accommodations
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {event.sensoryAccommodations.map((acc) => (
                <span
                  key={acc}
                  className="px-2.5 py-1 text-xs font-semibold bg-white text-emerald-900 border border-emerald-300 rounded-lg shadow-2xs"
                >
                  ✓ {acc.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Event Information
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Location & Registration Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Location & Attendance</h2>
          <div className="flex items-start gap-2.5 text-sm text-slate-700">
            <MapPin className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              {event.location?.isVirtual ? (
                <div>
                  <p className="font-bold">Virtual Webinar / Online Conference</p>
                  {event.location.virtualMeetingUrl && (
                    <a
                      href={event.location.virtualMeetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 underline font-semibold flex items-center gap-1 mt-1"
                    >
                      Join Meeting Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-bold">{event.location?.venueName || 'Community Venue'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {event.location?.address}, {event.location?.city}
                  </p>
                </div>
              )}
            </div>
          </div>

          {event.registrationInfo?.link && (
            <div className="pt-2">
              <a
                href={event.registrationInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                Register on Official Portal <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Host Organization */}
        <div className="border border-slate-200 rounded-2xl p-5 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Host Organization
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{org.name}</p>
          </div>
          {org.contactEmail && (
            <a href={`mailto:${org.contactEmail}`} className="text-teal-700 font-bold hover:underline">
              Contact Organizer
            </a>
          )}
        </div>
      </article>

      {reportOpen && (
        <ReportModal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          contentType="EVENT"
          contentId={event._id}
          contentTitle={event.title}
        />
      )}
    </div>
  );
};
