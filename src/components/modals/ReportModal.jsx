import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';

export const ReportModal = ({ isOpen, onClose, contentType, contentId, contentTitle }) => {
  const { success, error } = useToast();
  const [reason, setReason] = useState('INACCURATE_INFORMATION');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'INACCURATE_INFORMATION', label: 'Inaccurate or Misleading Information' },
    { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate or Offensive Content' },
    { value: 'EXPIRED_OR_OBSOLETE', label: 'Expired, Obsolete, or Dead Link' },
    { value: 'SCAM_OR_FRAUD', label: 'Suspected Scam or Financial Fraud' },
    { value: 'UNAUTHORIZED_ORGANIZATION', label: 'Unauthorized Use of Organization Name' },
    { value: 'OTHER', label: 'Other Concern' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportService.submitReport({
        contentType,
        contentId,
        reason,
        description
      });
      success('Your report has been submitted to administrators for review.');
      setDescription('');
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Content to Moderation Team"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Reporting Item</p>
          <p className="text-sm font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 truncate">
            {contentTitle || 'Selected Resource / Event'}
          </p>
        </div>

        <Select
          label="Reason for Report"
          id="report-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={reasons}
          required
        />

        <div>
          <label htmlFor="report-description" className="block text-sm font-semibold text-slate-700 mb-1">
            Additional Details (Optional)
          </label>
          <textarea
            id="report-description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please share specific details to help our moderation team verify the issue..."
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          ></textarea>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={loading}>
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};
