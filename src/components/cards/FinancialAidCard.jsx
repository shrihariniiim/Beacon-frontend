import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { IndianRupee, Calendar, Building, Flag, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FinancialAidCard = ({ aid, onReport }) => {
  const { isAuthenticated } = useAuth();
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

  // Calculate friendly days remaining (visual aid only, backend remains authoritative)
  let daysRemaining = null;
  if (deadlineDate && !isExpired) {
    const diff = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
    daysRemaining = diff > 0 ? `${diff} days remaining` : 'Closing today';
  }

  return (
    <article className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${
      isExpired ? 'border-slate-200 opacity-80' : 'border-slate-200'
    }`}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge variant="category" size="sm">
            {aid.aidType?.replace(/_/g, ' ')}
          </Badge>

          {isExpired ? (
            <Badge variant="expired" size="sm">
              Deadline Expired
            </Badge>
          ) : aid.status === 'VERIFIED' ? (
            <Badge variant="verified" size="sm" icon>
              Active Opportunity
            </Badge>
          ) : (
            <Badge variant="pending" size="sm">
              Review Pending
            </Badge>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-2 leading-snug">
          <Link to={`/financial-aid/${aid._id}`} className="focus:outline-none focus:underline">
            {aid.title}
          </Link>
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {aid.description}
        </p>

        {/* Grant Amount / Subsidy */}
        {aid.amount && (aid.amount.min > 0 || aid.amount.max > 0 || aid.amount.details) && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
              Subsidy / Grant Value
            </p>
            <p className="text-sm font-extrabold text-slate-900">
              {aid.amount.min > 0 && aid.amount.max > 0
                ? `${aid.amount.currency} ${aid.amount.min.toLocaleString()} – ${aid.amount.max.toLocaleString()}`
                : aid.amount.details || 'Full Direct Subsidy'}
            </p>
          </div>
        )}

        {/* Authoritative Deadline Display */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-teal-50/60 border border-teal-100 text-teal-900 font-medium mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            <span>Deadline: <strong className="font-bold">{formattedDeadline}</strong></span>
          </div>
          {daysRemaining && !isExpired && (
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
              {daysRemaining}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="truncate max-w-[180px]">
          <span className="font-medium text-slate-700 truncate block">
            {org.name || 'Accredited Welfare Body'}
          </span>
          <span className="text-[11px] text-slate-400">
            {aid.location?.isNational ? 'All India Scheme' : `${aid.location?.city || ''}, ${aid.location?.state || ''}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onReport && isAuthenticated && (
            <button
              type="button"
              onClick={() => onReport('FINANCIAL_AID', aid._id, aid.title)}
              aria-label={`Report financial aid opportunity ${aid.title}`}
              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <Flag className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
          <Link
            to={`/financial-aid/${aid._id}`}
            className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 focus:outline-none focus:underline"
          >
            Apply / Details &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
