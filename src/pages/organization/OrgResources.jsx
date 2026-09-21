import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import { orgService } from '../../services/orgService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { BookOpen, Plus, Trash2, Edit2, Lock, ShieldAlert } from 'lucide-react';

const CATEGORIES = [
  { value: 'EDUCATIONAL', label: 'Educational Toolkit' },
  { value: 'THERAPY_SUPPORT', label: 'Therapy & AAC Support' },
  { value: 'GOVERNMENT_SCHEME', label: 'Government Welfare Scheme' },
  { value: 'ACCESSIBILITY', label: 'Accessibility & Mobility' },
  { value: 'COMMUNITY', label: 'Community & Peer Support' },
  { value: 'PARENT_SUPPORT', label: 'Caregiver Mental Health & Respite' },
  { value: 'TOOLKIT', label: 'Practical Home Toolkit' },
  { value: 'EMERGENCY_HELPLINE', label: 'Emergency & Crisis Helpline' }
];

export const OrgResources = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [resources, setResources] = useState([]);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('EDUCATIONAL');
  const [targetAgeGroups, setTargetAgeGroups] = useState(['SCHOOL_AGE']);
  const [sensoryTags, setSensoryTags] = useState(['NOISE_SENSITIVE']);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const [orgData, resData] = await Promise.all([
        orgService.getOrgById(user.organizationId),
        resourceService.getMyOrgResources({ limit: 50 })
      ]);
      setOrg(orgData);
      setResources(resData.data || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load organization resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.createResource({
        title,
        description,
        category,
        targetAgeGroups,
        sensoryTags
      });
      success('Resource submitted successfully! It is now pending moderation review before publication.');
      setModalOpen(false);
      setTitle('');
      setDescription('');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await resourceService.deleteResource(id);
      success('Resource removed');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const isVerified = org?.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-teal-700" aria-hidden="true" />
            Organization Resource Publications
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Author and manage evidence-based guides, toolkits, and disability programs published under your entity.
          </p>
        </div>

        {isVerified ? (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
            Submit New Resource
          </Button>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Verification required before publishing</span>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message="Loading your resources..." count={3} />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources submitted yet"
          description="Once your organization is verified, submit inclusive toolkits and therapy guides to help caregivers."
          icon={BookOpen}
          actionLabel={isVerified ? 'Create First Resource' : undefined}
          onAction={isVerified ? () => setModalOpen(true) : undefined}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {resources.map((res) => {
            const isApproved = res.verificationStatus === 'VERIFIED';
            const isPending = res.verificationStatus === 'PENDING_REVIEW';
            const isRejected = res.verificationStatus === 'REJECTED';

            return (
              <div key={res._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge variant="category" size="sm">
                      {res.category}
                    </Badge>
                    <Badge
                      variant={isApproved ? 'verified' : isPending ? 'pending' : 'rejected'}
                      size="sm"
                      icon
                    >
                      {res.verificationStatus}
                    </Badge>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{res.title}</h2>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(res._id, res.title)}
                    aria-label={`Delete ${res.title}`}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Resource for Review"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateResource} className="space-y-4">
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-950 rounded-xl text-xs">
            <p className="font-bold">Decoupled Verification Workflow:</p>
            <p className="mt-0.5 text-teal-800">
              Submitted resources enter <strong>PENDING_REVIEW</strong> and are inspected by platform administrators to ensure accurate, safe information before appearing publicly.
            </p>
          </div>

          <Input
            label="Resource Title"
            id="res-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Visual Sensory Daily Schedules for Home Routine"
            required
          />

          <Select
            label="Category"
            id="res-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
            required
          />

          <div>
            <label htmlFor="res-desc" className="block text-sm font-semibold text-slate-700 mb-1">
              Resource Description & Instructions <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="res-desc"
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide comprehensive details, instructions, or downloadable links for caregivers..."
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit for Moderation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
