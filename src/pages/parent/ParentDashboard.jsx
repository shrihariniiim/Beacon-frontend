import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { childProfileService } from '../../services/childProfileService';
import { resourceService } from '../../services/resourceService';
import { bookmarkService } from '../../services/bookmarkService';
import { ResourceCard } from '../../components/cards/ResourceCard';
import { ChildProfileModal } from '../../components/modals/ChildProfileModal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Sparkles,
  Heart,
  Bookmark,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [matchedResources, setMatchedResources] = useState([]);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch children
      const kids = await childProfileService.getMyChildren();
      setChildren(kids);

      const activeKidId = selectedChildId || (kids.length > 0 ? kids[0]._id : '');
      if (kids.length > 0 && !selectedChildId) {
        setSelectedChildId(kids[0]._id);
      }

      // 2. Fetch matched resources deterministically
      if (activeKidId) {
        const matched = await resourceService.getMatchedResources(activeKidId);
        setMatchedResources(matched);
      } else {
        setMatchedResources([]);
      }

      // 3. Fetch recent bookmarks
      const bRes = await bookmarkService.getBookmarks({ limit: 4 });
      setRecentBookmarks(bRes.data || []);
    } catch (err) {
      console.error('Failed to load parent dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedChildId]);

  const selectedChild = children.find((c) => c._id === selectedChildId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <span>Caregiver Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Your personalized caregiver dashboard matches verified toolkits, speech exercises, and welfare opportunities directly to your child's developmental profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Bookmark}
            onClick={() => {}}
          >
            <Link to="/parent/bookmarks">Saved Bookmarks ({recentBookmarks.length})</Link>
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            Add Child Profile
          </Button>
        </div>
      </div>

      {/* Child Profile Selector Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" aria-hidden="true" />
            Your Registered Children
          </h2>
          <Link
            to="/parent/children"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline focus:outline-none"
          >
            Manage Profiles &rarr;
          </Link>
        </div>

        {children.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">No child profiles created yet.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Adding a child profile enables rule-based matching for sensory adaptations, age-appropriate educational toolkits, and speech therapy resources.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setModalOpen(true)}
            >
              Add Your First Child Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {children.map((child) => {
              const isSelected = child._id === selectedChildId;
              return (
                <button
                  key={child._id}
                  type="button"
                  onClick={() => setSelectedChildId(child._id)}
                  className={`p-4 rounded-2xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                    isSelected
                      ? 'bg-teal-900 text-white border-teal-900 shadow-md ring-2 ring-teal-700'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base">{child.name}</span>
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {child.derivedAgeGroup?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {child.sensoryPreferences?.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-teal-800 text-teal-200' : 'bg-teal-50 text-teal-800'
                        }`}
                      >
                        {s.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Deterministic Preference-Based Matched Resources */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-extrabold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>Preference-Based Matching</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Matched Resources {selectedChild ? `for ${selectedChild.name}` : ''}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic rule-based matching based strictly on {selectedChild ? `${selectedChild.name}'s` : "your child's"} age group and sensory tags. (Zero AI involved).
            </p>
          </div>
          <Link
            to="/resources"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 focus:outline-none focus:underline"
          >
            Browse All Resources &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Matching verified resources..." count={2} />
        ) : matchedResources.length === 0 ? (
          <EmptyState
            title="No exact preference match found yet"
            description="Explore our full directory of verified resources and bookmark items to customize your library."
            actionLabel="Explore All Resources"
            onAction={() => {}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedResources.map((res) => (
              <ResourceCard
                key={res._id}
                resource={res}
                initialBookmarked={recentBookmarks.some((b) => b.resourceId?._id === res._id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add Child Profile Modal */}
      <ChildProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchData}
      />
    </div>
  );
};
