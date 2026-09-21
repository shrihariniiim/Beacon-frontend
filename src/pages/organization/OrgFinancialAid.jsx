import React, { useState, useEffect } from 'react';
import { financialAidService } from '../../services/financialAidService';
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
import { IndianRupee, Plus, Trash2, Calendar, Lock } from 'lucide-react';

const AID_TYPES = [
  { value: 'EQUIPMENT_SUBSIDY', label: 'Assistive Device Subsidy' },
  { value: 'THERAPY_COVERAGE', label: 'Therapy & AAC Coverage' },
  { value: 'GOVERNMENT_BENEFIT', label: 'Government Welfare Scheme' },
  { value: 'GRANT', label: 'Community Grant' },
  { value: 'SCHOLARSHIP', label: 'Student Scholarship' }
];

export const OrgFinancialAid = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aidType, setAidType] = useState('EQUIPMENT_SUBSIDY');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const [orgData, faData] = await Promise.all([
        orgService.getOrgById(user.organizationId),
        financialAidService.getMyOrgFinancialAid({ limit: 50 })
      ]);
      setOrg(orgData);
      setOpportunities(faData.data || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await financialAidService.create({
        title,
        description,
        aidType,
        eligibility,
        deadline,
        amount: {
          min: parseFloat(amountMin) || 0,
          max: parseFloat(amountMax) || 0,
          currency: 'INR'
        },
        applicationUrl
      });
      success('Financial aid opportunity submitted for moderation review!');
      setModalOpen(false);
      setTitle('');
      setDescription('');
      setEligibility('');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await financialAidService.delete(id);
      success('Opportunity removed');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete opportunity');
    }
  };

  const isVerified = org?.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <IndianRupee className="w-8 h-8 text-teal-700" aria-hidden="true" />
            Financial Aid & Subsidy Programs
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publish assistive device grants, therapy sponsorships, and welfare allowances.
          </p>
        </div>

        {isVerified ? (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
            Post New Opportunity
          </Button>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Verification required before posting financial aid</span>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message="Loading opportunities..." count={3} />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No financial aid opportunities posted yet"
          description="Verified organizations can sponsor therapy sessions or equipment subsidies for families."
          icon={IndianRupee}
          actionLabel={isVerified ? 'Post First Opportunity' : undefined}
          onAction={isVerified ? () => setModalOpen(true) : undefined}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {opportunities.map((item) => (
            <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="category" size="sm">
                    {item.aidType}
                  </Badge>
                  <Badge
                    variant={item.status === 'VERIFIED' ? 'verified' : item.status === 'EXPIRED' ? 'expired' : 'pending'}
                    size="sm"
                    icon
                  >
                    {item.status}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    Deadline: {new Date(item.deadline).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item._id, item.title)}
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
        title="Post Financial Aid Opportunity"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Opportunity Title"
            id="fa-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 2026 ADIP Speech Device Direct Subsidy"
            required
          />

          <Select
            label="Aid Category"
            id="fa-type"
            value={aidType}
            onChange={(e) => setAidType(e.target.value)}
            options={AID_TYPES}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Application Deadline"
              id="fa-deadline"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              helperText="Authoritative deadline."
              required
            />
            <Input
              label="Application URL"
              id="fa-url"
              type="url"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Grant (INR)"
              id="fa-min"
              type="number"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              placeholder="10000"
            />
            <Input
              label="Max Grant (INR)"
              id="fa-max"
              type="number"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              placeholder="50000"
            />
          </div>

          <div>
            <label htmlFor="fa-desc" className="block text-sm font-semibold text-slate-700 mb-1">
              Description & Benefits
            </label>
            <textarea
              id="fa-desc"
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how funds/devices are disbursed..."
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            ></textarea>
          </div>

          <div>
            <label htmlFor="fa-elig" className="block text-sm font-semibold text-slate-700 mb-1">
              Eligibility Requirements <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="fa-elig"
              rows="2"
              required
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="Income ceilings, required disability certificates (UDID), etc."
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit Opportunity for Moderation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
