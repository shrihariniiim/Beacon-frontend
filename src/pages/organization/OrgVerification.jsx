import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orgService } from '../../services/orgService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import {
  ShieldCheck,
  Upload,
  FileText,
  Lock,
  Clock,
  AlertCircle,
  Download,
  CheckCircle2
} from 'lucide-react';

export const OrgVerification = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [org, setOrg] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrg = async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const data = await orgService.getOrgById(user.organizationId);
      setOrg(data);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load organization credentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, [user]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      error('Please select a file to upload');
      return;
    }

    // Client-side file size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('File size exceeds the 5MB limit');
      return;
    }

    setUploading(true);
    try {
      await orgService.uploadDocument(user.organizationId, file);
      success('Verification credential uploaded successfully! Status updated to Pending Review.');
      setFile(null);
      // Reset input value
      const input = document.getElementById('org-doc-input');
      if (input) input.value = '';
      fetchOrg();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadDoc = async (docId, fileName) => {
    try {
      const blob = await orgService.downloadDocument(user.organizationId, docId);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading verification status..." count={2} />
      </div>
    );
  }

  const isVerified = org?.verificationStatus === 'VERIFIED';
  const isPending = org?.verificationStatus === 'PENDING';
  const isRejected = org?.verificationStatus === 'REJECTED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-8 h-8 text-teal-700" aria-hidden="true" />
          Organization Credentials & Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload official government gazettes, NGO Darpan certificates, or registration licenses to achieve verified partner status.
        </p>
      </div>

      {/* Current Status Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Verification Status</p>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{org?.name}</h2>
          </div>
          <Badge
            variant={isVerified ? 'verified' : isPending ? 'pending' : isRejected ? 'rejected' : 'suspended'}
            size="lg"
            icon
          >
            {org?.verificationStatus}
          </Badge>
        </div>

        {isVerified && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-bold">Accredited Organization</p>
              <p className="text-emerald-800 text-xs">
                Your organization is verified. All published resources, events, and financial aid opportunities receive trusted badges across the network.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="p-4 bg-rose-50 text-rose-950 rounded-2xl border border-rose-200 text-sm space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />
              Rejection Reason from Administrator:
            </p>
            <p className="text-rose-800 text-xs font-medium">
              "{org.rejectionReason || 'Uploaded documentation was insufficient or expired.'}"
            </p>
            <p className="text-slate-600 text-[11px] pt-1">
              Please upload a valid, clear replacement document below to automatically return your account to <strong>PENDING</strong> review.
            </p>
          </div>
        )}

        {/* Private File Upload Section */}
        <form onSubmit={handleFileUpload} className="space-y-4 pt-2">
          <div>
            <label htmlFor="org-doc-input" className="block text-sm font-bold text-slate-900 mb-1">
              Upload Official Documentation (PDF, PNG, JPEG, WebP &bull; Max 5MB)
            </label>
            <input
              id="org-doc-input"
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100 border border-slate-300 rounded-xl p-2 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Private storage: Documents are never published or publicly indexed.</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={uploading}
              disabled={!file}
              icon={Upload}
            >
              Upload Document
            </Button>
          </div>
        </form>
      </div>

      {/* Submitted Documents History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Submitted Credentials Archive</h2>

        {!org?.submittedDocuments || org.submittedDocuments.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-xs text-slate-500">
            No verification credentials uploaded yet.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
            {org.submittedDocuments.map((doc) => {
              const uploadDate = new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const sizeInKb = (doc.size / 1024).toFixed(1);

              return (
                <div key={doc._id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <FileText className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-sm">{doc.originalName}</p>
                      <p className="text-xs text-slate-400">
                        {sizeInKb} KB &bull; Uploaded on {uploadDate}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadDoc(doc._id, doc.originalName)}
                  >
                    Download
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
