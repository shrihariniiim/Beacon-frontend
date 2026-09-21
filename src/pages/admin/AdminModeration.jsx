import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { resourceService } from '../../services/resourceService';
import { eventService } from '../../services/eventService';
import { financialAidService } from '../../services/financialAidService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { BookOpen, Calendar, IndianRupee, Check, X, ShieldAlert, AlertTriangle } from 'lucide-react';

export const AdminModeration = () => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('RESOURCES'); // 'RESOURCES' | 'EVENTS' | 'FINANCIAL_AID'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'RESOURCES') {
        const res = await resourceService.getResources({ verifiedOnly: false, limit: 20 });
        setItems(res.data || []);
      } else if (activeTab === 'EVENTS') {
        const res = await eventService.getEvents({ limit: 20 });
        setItems(res.data || []);
      } else if (activeTab === 'FINANCIAL_AID') {
        const res = await financialAidService.getFinancialAid({ limit: 20, activeOnly: false });
        setItems(res.data || []);
      }
    } catch (err) {
      error('Failed to load content for moderation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const handleModerateResource = async (id, status) => {
    setActionLoading(true);
    try {
      await adminService.moderateResource(id, status);
      success(`Resource status updated to ${status}. Audit entry recorded.`);
      fetchContent();
    } catch (err) {
      error(err.response?.data?.message || 'Moderation action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModerateEvent = async (id, status) => {
    setActionLoading(true);
    try {
      await adminService.moderateEvent(id, status);
      success(`Event status updated to ${status}. Audit entry recorded.`);
      fetchContent();
    } catch (err) {
      error(err.response?.data?.message || 'Moderation action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModerateAid = async (id, status) => {
    setActionLoading(true);
    try {
      await adminService.moderateFinancialAid(id, status);
      success(`Financial aid status updated to ${status}. Audit entry recorded.`);
      fetchContent();
    } catch (err) {
      error(err.response?.data?.message || 'Moderation action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-8 h-8 text-teal-700" aria-hidden="true" />
          Decoupled Content Moderation
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review, approve, or suspend individual toolkits, community events, and financial aid schemes submitted by verified partners.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('RESOURCES')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            activeTab === 'RESOURCES' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Educational Resources
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EVENTS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            activeTab === 'EVENTS' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Community Events
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('FINANCIAL_AID')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            activeTab === 'FINANCIAL_AID' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <IndianRupee className="w-4 h-4" /> Financial Aid & Subsidies
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading items for moderation..." count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No content in this moderation queue"
          description="All submitted items have been reviewed."
          icon={BookOpen}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {items.map((item) => {
            const status = item.verificationStatus || item.status;
            const org = item.organizationId || {};

            return (
              <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge variant={status === 'VERIFIED' ? 'verified' : status === 'EXPIRED' ? 'expired' : 'pending'} size="sm" icon>
                      {status}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500">
                      Organization: {org.name || 'Verified Entity'}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {status !== 'VERIFIED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Check}
                      loading={actionLoading}
                      onClick={() => {
                        if (activeTab === 'RESOURCES') handleModerateResource(item._id, 'VERIFIED');
                        if (activeTab === 'EVENTS') handleModerateEvent(item._id, 'VERIFIED');
                        if (activeTab === 'FINANCIAL_AID') handleModerateAid(item._id, 'VERIFIED');
                      }}
                    >
                      Verify & Publish
                    </Button>
                  )}

                  {status === 'VERIFIED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={ShieldAlert}
                      loading={actionLoading}
                      onClick={() => {
                        if (activeTab === 'RESOURCES') handleModerateResource(item._id, 'SUSPENDED');
                        if (activeTab === 'EVENTS') handleModerateEvent(item._id, 'SUSPENDED');
                        if (activeTab === 'FINANCIAL_AID') handleModerateAid(item._id, 'SUSPENDED');
                      }}
                    >
                      Suspend Content
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
