import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resourceService } from '../../services/resourceService';
import { bookmarkService } from '../../services/bookmarkService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ReportModal } from '../../components/modals/ReportModal';
import {
  ShieldCheck,
  Bookmark,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Flag,
  ArrowLeft,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isParent } = useAuth();
  const { success, error } = useToast();

  const [resource, setResource] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [togglingBookmark, setTogglingBookmark] = useState(false);

  useEffect(() => {
    const fetchResourceData = async () => {
      setLoading(true);
      setErrMessage(null);
      try {
        const data = await resourceService.getResourceById(id);
        setResource(data);

        if (isAuthenticated && isParent) {
          const statusRes = await bookmarkService.checkStatus(id);
          setIsBookmarked(statusRes.isBookmarked);
        }
      } catch (err) {
        setErrMessage(err.response?.data?.message || 'Failed to load resource details');
      } finally {
        setLoading(false);
      }
    };

    fetchResourceData();
  }, [id, isAuthenticated, isParent]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated || !isParent) {
      error('Please sign in as a parent to bookmark resources');
      return;
    }

    setTogglingBookmark(true);
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(id);
        setIsBookmarked(false);
        success('Resource removed from saved bookmarks');
      } else {
        await bookmarkService.addBookmark(id);
        setIsBookmarked(true);
        success('Resource saved to bookmarks');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setTogglingBookmark(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading resource details..." count={1} />
      </div>
    );
  }

  if (errMessage || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Resource Unavailable"
          message={errMessage || 'This resource could not be found or is currently under moderation review.'}
          onRetry={() => navigate('/resources')}
        />
      </div>
    );
  }

  const org = resource.organizationId || {};
  const isGov = org.type === 'GOVERNMENT';
  const isVerified = resource.verificationStatus === 'VERIFIED';

  const updatedDate = new Date(resource.updatedAt || resource.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 focus:outline-none focus:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Resource Discovery
        </Link>
      </div>

      {/* Main Content Card */}
      <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="category" size="md">
              {resource.category?.replace(/_/g, ' ')}
            </Badge>

            {isGov ? (
              <Badge variant="government" size="md" icon>
                Official Government Program
              </Badge>
            ) : isVerified ? (
              <Badge variant="verified" size="md" icon>
                Verified Resource
              </Badge>
            ) : (
              <Badge variant="pending" size="md">
                Review Pending
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && isParent && (
              <Button
                variant={isBookmarked ? 'secondary' : 'outline'}
                size="sm"
                icon={Bookmark}
                loading={togglingBookmark}
                onClick={handleToggleBookmark}
              >
                {isBookmarked ? 'Saved in Bookmarks' : 'Bookmark'}
              </Button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                aria-label="Report resource"
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <Flag className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {resource.title}
          </h1>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            Last Verified & Updated: {updatedDate}
          </p>
        </div>

        {/* Target Age Groups & Sensory Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {resource.targetAgeGroups?.map((ag) => (
            <span
              key={ag}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg"
            >
              Age: {ag.replace(/_/g, ' ')}
            </span>
          ))}

          {resource.sensoryTags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-200 rounded-lg"
            >
              #{tag.replace(/_/g, ' ').toLowerCase()}
            </span>
          ))}
        </div>

        {/* Full Description */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Resource Overview
          </h2>
          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {resource.description}
          </div>
        </div>

        {/* Eligibility Criteria */}
        {resource.eligibilityCriteria && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
              Eligibility & Intended Audience
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {resource.eligibilityCriteria}
            </p>
          </div>
        )}

        {/* Publishing Organization Card */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Published & Verified By
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{org.name}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                {org.description}
              </p>
            </div>
            <Badge variant={isGov ? 'government' : 'verified'} size="sm" icon>
              {isGov ? 'Government Directorate' : 'Verified Partner NGO'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {org.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${org.contactEmail}`} className="text-teal-700 hover:underline truncate">
                  {org.contactEmail}
                </a>
              </div>
            )}
            {org.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                <span>{org.contactPhone}</span>
              </div>
            )}
            {org.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline flex items-center gap-1">
                  Visit Official Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {org.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                <span>{org.address.city}, {org.address.state}</span>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Report Modal */}
      {reportOpen && (
        <ReportModal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          contentType="RESOURCE"
          contentId={resource._id}
          contentTitle={resource.title}
        />
      )}
    </div>
  );
};
