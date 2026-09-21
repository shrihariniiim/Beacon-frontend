import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { FileText, Shield, Clock, User, ArrowRight } from 'lucide-react';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs({ page, limit: 15 });
      setLogs(res.data || []);
      if (res.meta) {
        setPagination({
          total: res.meta.total,
          totalPages: res.meta.totalPages
        });
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
          <Shield className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Immutable Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="w-8 h-8 text-teal-700" aria-hidden="true" />
          Administrative Audit Logs
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          A secure, append-only chronological record of all accreditation decisions, content moderation actions, user status updates, and report resolutions.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Fetching immutable audit records..." count={4} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No audit entries recorded yet"
          description="High-impact administrative actions will generate immutable audit entries here."
          icon={FileText}
        />
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Timestamp</th>
                    <th scope="col" className="px-6 py-3.5">Administrator</th>
                    <th scope="col" className="px-6 py-3.5">Action</th>
                    <th scope="col" className="px-6 py-3.5">Target</th>
                    <th scope="col" className="px-6 py-3.5">Details & Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => {
                    const formattedTime = new Date(log.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });

                    return (
                      <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {formattedTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">
                            {log.actorId?.name || 'Administrator'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {log.actorId?.email}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md font-bold text-[11px] bg-teal-50 text-teal-800 border border-teal-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
                          {log.targetType}
                        </td>
                        <td className="px-6 py-4">
                          <pre className="font-mono text-[11px] bg-slate-100 p-2 rounded-lg text-slate-800 max-w-xs truncate overflow-x-auto">
                            {JSON.stringify(log.metadata || {})}
                          </pre>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};
