import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { orgService } from '../../services/orgService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import {
  ShieldCheck,
  Building2,
  FileText,
  Check,
  X,
  AlertTriangle,
  Download,
  Clock
} from 'lucide-react';

export const AdminVerifications = () => {
  const { success, error } = useToast();
  const [organizations, setOrganizations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  // Modals State
  const [inspectOrg, setInspectOrg] = useState(null);
  const [rejectOrg, setRejectOrg] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVerifications({ status: statusFilter, limit: 20 });
      setOrganizations(res.data || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, [statusFilter]);

  const handleApprove = async (orgId) => {
    setActionLoading(true);
    try {
      await adminService.approveOrg(orgId);
      success('Organization successfully verified and approved! Audit log generated.');
      fetchOrgs();
      setInspectOrg(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to approve organization');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      error('A clear rejection reason is mandatory');
      return;
    }

    setActionLoading(true);
    try {
      await adminService.rejectOrg(rejectOrg._id, rejectionReason.trim());
      success('Organization rejected with documented reason. Audit log generated.');
      setRejectOrg(null);
      setRejectionReason('');
      fetchOrgs();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to reject organization');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadDoc = async (orgId, docId, fileName) => {
    try {
      const blob = await orgService.downloadDocument(orgId, docId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      error('Failed to download private document.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-8 h-8 text-teal-700" aria-hidden="true" />
          Organization Accreditation & Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Inspect registration documents, verify official claims, and manage accreditation status.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
              statusFilter === st
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {st} Organizations
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading organizations for verification..." count={3} />
      ) : organizations.length === 0 ? (
        <EmptyState
          title={`No ${statusFilter.toLowerCase()} organizations`}
          description={`There are currently no organizations with status '${statusFilter}'.`}
          icon={Building2}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {organizations.map((org) => (
            <div key={org._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant={org.type === 'GOVERNMENT' ? 'government' : 'ngo'} size="sm">
                    {org.type}
                  </Badge>
                  <Badge variant="pending" size="sm">
                    {org.verificationStatus}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {org.address?.city}, {org.address?.state}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{org.name}</h2>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{org.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Contact: {org.contactEmail}</span>
                  <span>&bull;</span>
                  <span>Documents Uploaded: <strong>{org.submittedDocuments?.length || 0}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={FileText}
                  onClick={() => setInspectOrg(org)}
                >
                  Inspect Credentials
                </Button>

                {org.verificationStatus === 'PENDING' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Check}
                      loading={actionLoading}
                      onClick={() => handleApprove(org._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={X}
                      onClick={() => setRejectOrg(org)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Documents Modal */}
      {inspectOrg && (
        <Modal
          isOpen={!!inspectOrg}
          onClose={() => setInspectOrg(null)}
          title={`Accreditation Inspection: ${inspectOrg.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Claimed Type:</strong> {inspectOrg.type}</p>
              <p><strong>Official Contact:</strong> {inspectOrg.contactEmail} / {inspectOrg.contactPhone || 'N/A'}</p>
              <p><strong>Official Address:</strong> {inspectOrg.address?.city}, {inspectOrg.address?.state}</p>
              {inspectOrg.website && <p><strong>Website:</strong> {inspectOrg.website}</p>}
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-900">Submitted Verification Documents</h2>
              {!inspectOrg.submittedDocuments || inspectOrg.submittedDocuments.length === 0 ? (
                <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200 font-medium">
                  No documents have been uploaded by this organization yet.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {inspectOrg.submittedDocuments.map((doc) => (
                    <div key={doc._id} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-700" />
                        <span className="font-semibold text-slate-800">{doc.originalName}</span>
                        <span className="text-slate-400">({(doc.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        onClick={() => handleDownloadDoc(inspectOrg._id, doc._id, doc.originalName)}
                      >
                        Download & Verify
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {inspectOrg.verificationStatus === 'PENDING' && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="danger" size="sm" onClick={() => { setRejectOrg(inspectOrg); setInspectOrg(null); }}>
                  Reject Entity
                </Button>
                <Button variant="primary" size="sm" loading={actionLoading} onClick={() => handleApprove(inspectOrg._id)}>
                  Approve & Grant Publishing Privileges
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {rejectOrg && (
        <Modal
          isOpen={!!rejectOrg}
          onClose={() => { setRejectOrg(null); setRejectionReason(''); }}
          title={`Reject Organization: ${rejectOrg.name}`}
        >
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">Mandatory Feedback Required</p>
              <p>The organization will see this reason in their portal and must fix the issue to reapply.</p>
            </div>

            <div>
              <label htmlFor="reject-reason" className="block text-sm font-semibold text-slate-800 mb-1">
                Rejection Reason <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="reject-reason"
                rows="3"
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. The submitted registration certificate is expired or illegible. Please submit a certified copy..."
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setRejectOrg(null)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" loading={actionLoading}>
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
