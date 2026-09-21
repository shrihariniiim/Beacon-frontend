import React, { useState, useEffect, useCallback } from 'react';
import { financialAidService } from '../../services/financialAidService';
import { FinancialAidCard } from '../../components/cards/FinancialAidCard';
import { ReportModal } from '../../components/modals/ReportModal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Select } from '../../components/common/Select';
import { IndianRupee } from 'lucide-react';

const AID_TYPES = [
  { value: '', label: 'All Aid Types' },
  { value: 'EQUIPMENT_SUBSIDY', label: 'Assistive Equipment & Device Subsidy' },
  { value: 'THERAPY_COVERAGE', label: 'Therapy & AAC Coverage' },
  { value: 'GOVERNMENT_BENEFIT', label: 'Government Direct Cash Allowance' },
  { value: 'GRANT', label: 'Community & Educational Grants' },
  { value: 'SCHOLARSHIP', label: 'Student Inclusive Scholarships' }
];

export const FinancialAidDiscovery = () => {
  const [aidType, setAidType] = useState('');
  const [page, setPage] = useState(1);
  const [opportunities, setOpportunities] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reportTarget, setReportTarget] = useState(null);

  const fetchAid = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await financialAidService.getFinancialAid({
        aidType: aidType || undefined,
        page,
        limit: 6,
        activeOnly: true // Excludes expired opportunities from active feed
      });

      setOpportunities(res.data || []);
      if (res.meta) {
        setPagination({
          total: res.meta.total,
          totalPages: res.meta.totalPages
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load financial aid opportunities');
    } finally {
      setLoading(false);
    }
  }, [aidType, page]);

  useEffect(() => {
    fetchAid();
  }, [fetchAid]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Financial Aid, Grants & Welfare Subsidies
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
          Verified government disability allowances, assistive equipment subsidies (ADIP), and accredited NGO therapy sponsorship programs.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Select
            id="aid-type-filter"
            value={aidType}
            onChange={(e) => {
              setAidType(e.target.value);
              setPage(1);
            }}
            options={AID_TYPES}
            aria-label="Filter by aid category"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{opportunities.length}</strong> active verified opportunities
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading financial aid schemes..." count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAid} />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No active opportunities in this category"
          description="Try selecting 'All Aid Types' or check back soon as accredited organizations post new grant cycles."
          icon={IndianRupee}
          actionLabel="Show All Categories"
          onAction={() => {
            setAidType('');
            setPage(1);
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((item) => (
              <FinancialAidCard
                key={item._id}
                aid={item}
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
