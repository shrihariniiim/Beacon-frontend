import React, { useState, useEffect } from 'react';
import { childProfileService } from '../../services/childProfileService';
import { ChildProfileModal } from '../../components/modals/ChildProfileModal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Calendar,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const ChildProfilesPage = () => {
  const { success, error } = useToast();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState(null);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const data = await childProfileService.getMyChildren();
      setChildren(data);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load child profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the profile for ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await childProfileService.deleteChild(id);
      success(`Profile for ${name} removed`);
      fetchChildren();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete profile');
    }
  };

  const handleEdit = (child) => {
    setChildToEdit(child);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setChildToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500" aria-hidden="true" />
            Child Profiles & Support Needs
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your family profiles to enable rule-based resource matching and sensory adaptations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleCreate}
        >
          Add Child Profile
        </Button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <Lock className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-bold text-slate-200">Strict Privacy Guarantee</p>
          <p className="text-slate-400 mt-0.5">
            Child profiles are strictly accessible by you and authorized system administrators. Other parents and external organizations cannot view or search these records.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading child profiles..." count={2} />
      ) : children.length === 0 ? (
        <EmptyState
          title="No child profiles added yet"
          description="Create your child's profile with their birth date and sensory preferences to receive matched verified toolkits."
          actionLabel="Create Profile Now"
          onAction={handleCreate}
        />
      ) : (
        <div className="space-y-4">
          {children.map((child) => {
            const birthDateFormatted = new Date(child.birthDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div
                key={child._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-base">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{child.name}</h2>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          Born: {birthDateFormatted}
                        </span>
                        <span>&bull;</span>
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          Authoritative Age Group: {child.derivedAgeGroup?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleEdit(child)}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDelete(child._id, child.name)}
                      aria-label={`Delete profile for ${child.name}`}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Sensory Sensitivities */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Sensory Sensitivities:
                  </p>
                  {child.sensoryPreferences?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {child.sensoryPreferences.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-200 rounded-lg"
                        >
                          {s.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No sensory sensitivities specified.</p>
                  )}
                </div>

                {/* Support Needs */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Therapy & Accessibility Support Needs:
                  </p>
                  {child.supportNeeds?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {child.supportNeeds.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg"
                        >
                          {s.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No support needs specified.</p>
                  )}
                </div>

                {/* Private Notes */}
                {child.notes && (
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed border border-slate-200/70">
                    <strong className="font-semibold text-slate-800">Caregiver Notes:</strong> {child.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ChildProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        childToEdit={childToEdit}
        onSaved={fetchChildren}
      />
    </div>
  );
};
