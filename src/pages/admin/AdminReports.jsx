import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Flag, CheckCircle2, XCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

export const AdminReports = () => {
  const { success, error } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeReport, setActiveReport] = useState(null);
  const [actionTaken, setActionTaken] = useState('');
  const [suspendContent, setSuspendContent] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getReports({ limit: 25 });
      setReports(res.data || []);
    } catch (err) {
      error('Failed to load user reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.resolveReport(activeReport._id, {
        status: 'RESOLVED',
        actionTaken,
        suspendContent
      });
      success('Report resolved and action recorded. Audit log generated.');
      setActiveReport(null);
      setActionTaken('');
      fetchReports();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to resolve report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await adminService.resolveReport(reportId, {
        status: 'DISMISSED',
        actionTaken: 'Report reviewed and determined to be compliant.'
      });
      success('Report dismissed as non-infringing.');
      fetchReports();
    } catch (err) {
      error('Failed to dismiss report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Flag className="w-8 h-8 text-rose-600" aria-hidden="true" />
          Community Safety & Moderation Reports
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Investigate reported inaccuracy, expired schemes, or inappropriate content flagged by caregivers.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading community reports..." count={3} />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No pending safety reports"
          description="There are currently no flagged items requiring moderation investigation."
          icon={Flag}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {reports.map((r) => {
            const isPending = r.status === 'PENDING';
            const isResolved = r.status === 'RESOLVED';

            return (
              <div key={r._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge variant={isResolved ? 'verified' : isPending ? 'rejected' : 'default'} size="sm">
                      Status: {r.status}
                    </Badge>
                    <span className="text-xs font-bold text-slate-700">
                      Target: {r.contentType} (ID: {r.contentId})
                    </span>
                  </div>

                  <h2 className="text-sm font-extrabold text-slate-900">
                    Reason: {r.reason?.replace(/_/g, ' ')}
                  </h2>

                  {r.description && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      "{r.description}"
                    </p>
                  )}

                  <div className="text-xs text-slate-400">
                    Reported on {new Date(r.createdAt).toLocaleDateString()} by {r.reporterId?.email || 'Registered User'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={ShieldAlert}
                        onClick={() => setActiveReport(r)}
                      >
                        Resolve & Moderate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(r._id)}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      {activeReport && (
        <Modal
          isOpen={!!activeReport}
          onClose={() => setActiveReport(null)}
          title="Resolve Community Report"
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
              <p className="font-bold">Investigating Flagged Item:</p>
              <p>{activeReport.contentType} &bull; Reason: {activeReport.reason}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="suspend-check"
                checked={suspendContent}
                onChange={(e) => setSuspendContent(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="suspend-check" className="font-semibold text-xs text-slate-800">
                Immediately suspend the reported {activeReport.contentType.toLowerCase()} from public view
              </label>
            </div>

            <div>
              <label htmlFor="res-action" className="block text-sm font-semibold text-slate-700 mb-1">
                Moderation Action Notes <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="res-action"
                rows="3"
                required
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="Explain findings and reason for suspending or updating content..."
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setActiveReport(null)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" loading={submitting}>
                Confirm Resolution
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
