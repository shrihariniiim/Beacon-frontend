import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { LoadingState } from '../../components/common/LoadingState';
import {
  ShieldCheck,
  Building2,
  Users,
  BookOpen,
  Calendar,
  IndianRupee,
  Flag,
  FileText,
  Lock,
  ArrowRight,
  Clock
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingState message="Loading administrative metrics..." count={2} />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Pending Verifications',
      value: stats?.organizations?.pending || 0,
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      link: '/admin/verifications',
      actionText: 'Review Organizations'
    },
    {
      title: 'Pending Reports',
      value: stats?.reports?.pending || 0,
      icon: Flag,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      link: '/admin/reports',
      actionText: 'Moderate Reports'
    },
    {
      title: 'Resources Pending Review',
      value: stats?.resources?.pending || 0,
      icon: BookOpen,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      link: '/admin/moderation',
      actionText: 'Moderate Content'
    },
    {
      title: 'Verified Organizations',
      value: stats?.organizations?.verified || 0,
      icon: Building2,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      link: '/admin/verifications',
      actionText: 'View Entities'
    },
    {
      title: 'Registered Users',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'text-slate-700 bg-slate-50 border-slate-200',
      link: '/admin/users',
      actionText: 'Manage Users'
    },
    {
      title: 'Audit Logs',
      value: 'Immutable',
      icon: FileText,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      link: '/admin/audit-logs',
      actionText: 'Inspect Trail'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 text-teal-300 text-xs font-bold border border-teal-700">
          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Platform Administration & Trust Console</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          BeaconCare Oversight & Moderation
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Manage organization accreditations, content verification pipelines, user safety reports, and immutable audit logs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              <div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  to={card.link}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center justify-between focus:outline-none focus:underline"
                >
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Shortcuts for Dedicated Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            Workflow 1: Organization Accreditation
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Review registration documents, check official gazettes / Darpan IDs, approve legitimate entities, or reject with documented reasons.
          </p>
          <Link
            to="/admin/verifications"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline pt-1"
          >
            Go to Organization Verifications &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-700" />
            Workflow 2: Content Moderation & Reporting
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Decoupled content review for resources, webinars, and financial aid. Inspect flagged items reported by families and apply content suspensions.
          </p>
          <Link
            to="/admin/moderation"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:underline pt-1"
          >
            Go to Content Moderation &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
