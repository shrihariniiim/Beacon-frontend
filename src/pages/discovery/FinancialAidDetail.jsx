import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { financialAidService } from '../../services/financialAidService';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ReportModal } from '../../components/modals/ReportModal';
import {
  IndianRupee,
  Calendar,
  Building2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  AlertTriangle,
  Flag
} from 'lucide-react';

export const FinancialAidDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [aid, setAid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const fetchAid = async () => {
      setLoading(true);
      setErrMessage(null);
      try {
        const data = await financialAidService.getById(id);
        setAid(data);
      } catch (err) {
        setErrMessage(err.response?.data?.message || 'Failed to load opportunity details');
      } finally {
        setLoading(false);
      }
    };

    fetchAid();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading opportunity details..." count={1} />
      </div>
    );
  }

  if (errMessage || !aid) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Opportunity Unavailable"
          message={errMessage || 'This financial aid opportunity could not be found.'}
          onRetry={() => navigate('/financial-aid')}
        />
      </div>
    );
  }

  const org = aid.organizationId || {};
  const deadlineDate = aid.deadline ? new Date(aid.deadline) : null;
  const isExpired = aid.status === 'EXPIRED' || (deadlineDate && deadlineDate < new Date());

  const formattedDeadline = deadlineDate
    ? deadlineDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Ongoing';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/financial-aid"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 focus:outline-none focus:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Financial Aid Opportunities
        </Link>
      </div>

      <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="category" size="md">
              {aid.aidType?.replace(/_/g, ' ')}
            </Badge>

            {isExpired ? (
              <Badge variant="expired" size="md">
                Application Deadline Passed
              </Badge>
            ) : aid.status === 'VERIFIED' ? (
              <Badge variant="verified" size="md" icon>
                Active Verified Opportunity
              </Badge>
            ) : (
              <Badge variant="pending" size="md">
                Review Pending
              </Badge>
            )}
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              aria-label="Report opportunity"
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Flag className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {aid.title}
          </h1>

          {/* Authoritative Deadline Banner */}
          <div className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isExpired ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-teal-50 border-teal-200 text-teal-950'
          }`}>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="w-5 h-5 text-teal-700" aria-hidden="true" />
              <span>Authoritative Application Deadline: <strong className="font-extrabold">{formattedDeadline}</strong></span>
            </div>
            {isExpired ? (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Submissions Closed
              </span>
            ) : (
              <span className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full w-fit">
                Open for Applications
              </span>
            )}
          </div>
        </div>

        {/* Grant Amount Details */}
        {aid.amount && (aid.amount.min > 0 || aid.amount.max > 0 || aid.amount.details) && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Grant / Subsidy Value
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {aid.amount.min > 0 && aid.amount.max > 0
                ? `${aid.amount.currency} ${aid.amount.min.toLocaleString()} – ${aid.amount.max.toLocaleString()}`
                : aid.amount.details || 'Full Direct Subsidy'}
            </p>
          </div>
        )}

        {/* Description */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Scheme Description
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {aid.description}
          </p>
        </div>

        {/* Eligibility */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
            Mandatory Eligibility Requirements
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {aid.eligibility}
          </p>
        </div>

        {/* Application Link */}
        {aid.applicationUrl && !isExpired && (
          <div className="pt-2">
            <a
              href={aid.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              Apply on Official Website <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Sponsoring Organization */}
        <div className="border border-slate-200 rounded-2xl p-5 flex items-center justify-between text-xs text-slate-600 pt-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Funding / Administering Body
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{org.name}</p>
          </div>
          {aid.contactInfo?.email && (
            <a href={`mailto:${aid.contactInfo.email}`} className="text-teal-700 font-bold hover:underline">
              {aid.contactInfo.email}
            </a>
          )}
        </div>
      </article>

      {reportOpen && (
        <ReportModal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          contentType="FINANCIAL_AID"
          contentId={aid._id}
          contentTitle={aid.title}
        />
      )}
    </div>
  );
};
