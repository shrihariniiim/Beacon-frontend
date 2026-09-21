import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orgService } from '../../services/orgService';
import { resourceService } from '../../services/resourceService';
import { eventService } from '../../services/eventService';
import { financialAidService } from '../../services/financialAidService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import {
  Building2,
  ShieldCheck,
  Clock,
  AlertCircle,
  Upload,
  BookOpen,
  Calendar,
  IndianRupee,
  Lock,
  ArrowRight,
  Plus
} from 'lucide-react';

export const OrgDashboard = () => {
  const { user } = useAuth();
  const [org, setOrg] = useState(null);
  const [counts, setCounts] = useState({ resources: 0, events: 0, financialAid: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgData = async () => {
      if (!user?.organizationId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const orgData = await orgService.getOrgById(user.organizationId);
        setOrg(orgData);

        const [resData, evData, faData] = await Promise.all([
          resourceService.getMyOrgResources({ limit: 1 }),
          eventService.getMyOrgEvents({ limit: 1 }),
          financialAidService.getMyOrgFinancialAid({ limit: 1 })
        ]);

        setCounts({
          resources: resData.meta?.total || 0,
          events: evData.meta?.total || 0,
          financialAid: faData.meta?.total || 0
        });
      } catch (err) {
        console.error('Failed to load organization data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <LoadingState message="Loading organization portal..." count={2} />
      </div>
    );
  }

  const isVerified = org?.verificationStatus === 'VERIFIED';
  const isPending = org?.verificationStatus === 'PENDING';
  const isRejected = org?.verificationStatus === 'REJECTED';
  const isSuspended = org?.verificationStatus === 'SUSPENDED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {org?.type === 'GOVERNMENT' ? 'Government Welfare Entity' : 'Non-Governmental Organization'}
            </span>
            <Badge
              variant={
                isVerified ? 'verified' : isPending ? 'pending' : isRejected ? 'rejected' : 'suspended'
              }
              size="sm"
              icon
            >
              Status: {org?.verificationStatus || 'PENDING'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {org?.name || 'Organization Portal'}
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            {org?.description || 'Manage published resources, community events, and verification documentation.'}
          </p>
        </div>

        <Link to="/organization/verification">
          <Button variant="outline" size="md" icon={Upload}>
            Manage Documents ({org?.submittedDocuments?.length || 0})
          </Button>
        </Link>
      </div>

      {/* Prominent Verification Status Notice */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-sm text-amber-950">
            <h2 className="font-bold text-base text-amber-900">Verification Under Review</h2>
            <p className="text-amber-800 leading-relaxed">
              Your organization credentials are currently awaiting manual inspection by platform administrators. Content publication privileges will automatically unlock once verified.
            </p>
            <div className="pt-2">
              <Link
                to="/organization/verification"
                className="font-bold text-amber-900 hover:underline flex items-center gap-1 text-xs"
              >
                Inspect Uploaded Credentials &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-2 text-sm text-rose-950">
            <h2 className="font-bold text-base text-rose-900">Verification Needs Attention</h2>
            <p className="text-rose-800 leading-relaxed">
              Administrator Reason: <strong className="text-rose-950 font-bold">{org?.rejectionReason || 'Uploaded documentation was incomplete or unreadable.'}</strong>
            </p>
            <Link to="/organization/verification">
              <Button variant="danger" size="sm" icon={Upload} className="mt-2">
                Re-submit Verification Credentials
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Metrics & Publishing Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Resources */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-3">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Educational Resources & Toolkits</h2>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.resources}</p>
            <p className="text-xs text-slate-500 mt-1">Published or submitted for review</p>
          </div>

          <div className="pt-2">
            {isVerified ? (
              <Link
                to="/organization/resources"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" /> Manage & Publish Resources
              </Link>
            ) : (
              <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-500 flex items-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Publishing locked until verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Community Events */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-3">
              <Calendar className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Sensory-Friendly Events</h2>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.events}</p>
            <p className="text-xs text-slate-500 mt-1">Community workshops & webinars</p>
          </div>

          <div className="pt-2">
            {isVerified ? (
              <Link
                to="/organization/events"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" /> Manage & Post Events
              </Link>
            ) : (
              <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-500 flex items-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Publishing locked until verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Financial Aid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
              <IndianRupee className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Financial Aid & Grants</h2>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.financialAid}</p>
            <p className="text-xs text-slate-500 mt-1">Subsidies and sponsorship schemes</p>
          </div>

          <div className="pt-2">
            {isVerified ? (
              <Link
                to="/organization/financial-aid"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" /> Manage Opportunities
              </Link>
            ) : (
              <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-500 flex items-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Publishing locked until verified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
