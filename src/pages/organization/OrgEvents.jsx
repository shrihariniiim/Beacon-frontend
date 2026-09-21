import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { orgService } from '../../services/orgService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Calendar, Plus, Trash2, MapPin, Lock } from 'lucide-react';

export const OrgEvents = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [events, setEvents] = useState([]);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [venueName, setVenueName] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [virtualUrl, setVirtualUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const [orgData, evData] = await Promise.all([
        orgService.getOrgById(user.organizationId),
        eventService.getMyOrgEvents({ limit: 50 })
      ]);
      setOrg(orgData);
      setEvents(evData.data || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load organization events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await eventService.createEvent({
        title,
        description,
        startDate,
        time,
        location: {
          isVirtual,
          city: isVirtual ? 'Virtual' : city,
          venueName,
          virtualMeetingUrl: virtualUrl
        }
      });
      success('Event submitted for review! It will be verified by administrators.');
      setModalOpen(false);
      setTitle('');
      setDescription('');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel and delete "${title}"?`)) return;
    try {
      await eventService.deleteEvent(id);
      success('Event removed');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const isVerified = org?.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-8 h-8 text-teal-700" aria-hidden="true" />
            Organization Community Events
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Host and manage sensory-friendly workshops, caregiver webinars, and inclusive gatherings.
          </p>
        </div>

        {isVerified ? (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
            Host New Event
          </Button>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Verification required before hosting events</span>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message="Loading events..." count={3} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events scheduled yet"
          description="Create community events with quiet rooms, low glare, and verified staff to support families."
          icon={Calendar}
          actionLabel={isVerified ? 'Create First Event' : undefined}
          onAction={isVerified ? () => setModalOpen(true) : undefined}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {events.map((ev) => (
            <div key={ev._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant={ev.status === 'VERIFIED' ? 'verified' : 'pending'} size="sm" icon>
                    {ev.status}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    {new Date(ev.startDate).toLocaleDateString()} &bull; {ev.time || 'Time TBD'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">{ev.title}</h2>
                <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(ev._id, ev.title)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Host Community Event"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title"
            id="ev-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sensory Art & Tactile Exploration Circle"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Event Date"
              id="ev-date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="Time Range"
              id="ev-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM - 1:00 PM"
              required
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              id="ev-virtual"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="ev-virtual">This is a virtual / online event</label>
          </div>

          {isVirtual ? (
            <Input
              label="Virtual Meeting URL"
              id="ev-vurl"
              type="url"
              value={virtualUrl}
              onChange={(e) => setVirtualUrl(e.target.value)}
              placeholder="https://zoom.us/j/..."
              required
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                id="ev-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Coimbatore"
                required
              />
              <Input
                label="Venue Name"
                id="ev-venue"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Civic Auditorium"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="ev-desc" className="block text-sm font-semibold text-slate-700 mb-1">
              Event Description & Accommodations
            </label>
            <textarea
              id="ev-desc"
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the sensory room, sound dampening, parking, and RSVP instructions..."
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit Event for Moderation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
