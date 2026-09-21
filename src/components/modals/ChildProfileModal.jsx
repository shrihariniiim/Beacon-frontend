import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { childProfileService } from '../../services/childProfileService';
import { useToast } from '../../context/ToastContext';

const SENSORY_OPTIONS = [
  { value: 'NOISE_SENSITIVE', label: 'Noise Sensitivity (Needs Quiet Spaces / Dampening)' },
  { value: 'LIGHT_SENSITIVE', label: 'Light Sensitivity (Sensitive to Bright Flashes)' },
  { value: 'TACTILE_SENSITIVE', label: 'Tactile Sensitivity (Texture / Fabric Avoidance)' },
  { value: 'CALM_SPACE_NEEDED', label: 'Calm Down / Sensory Respite Room Needed' },
  { value: 'SENSORY_SEEKING', label: 'Sensory Seeking (Vigorous Movement / Tactile Input)' }
];

const SUPPORT_OPTIONS = [
  { value: 'SPEECH_THERAPY', label: 'Speech & Language Therapy / AAC' },
  { value: 'OCCUPATIONAL_THERAPY', label: 'Occupational & Sensory Integration Therapy' },
  { value: 'WHEELCHAIR_ACCESSIBLE', label: 'Wheelchair / Physical Mobility Accessibility' },
  { value: 'ASL_INTERPRETER', label: 'Sign Language (ASL / ISL) Interpreter' },
  { value: 'BEHAVIORAL_SUPPORT', label: 'Behavioral & Emotional De-escalation Support' },
  { value: 'ASSISTIVE_TECH', label: 'Assistive Learning Devices & Screen Readers' }
];

export const ChildProfileModal = ({ isOpen, onClose, childToEdit = null, onSaved }) => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sensoryPreferences, setSensoryPreferences] = useState([]);
  const [supportNeeds, setSupportNeeds] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (childToEdit) {
      setName(childToEdit.name || '');
      setBirthDate(childToEdit.birthDate ? childToEdit.birthDate.split('T')[0] : '');
      setSensoryPreferences(childToEdit.sensoryPreferences || []);
      setSupportNeeds(childToEdit.supportNeeds || []);
      setNotes(childToEdit.notes || '');
    } else {
      setName('');
      setBirthDate('');
      setSensoryPreferences([]);
      setSupportNeeds([]);
      setNotes('');
    }
  }, [childToEdit, isOpen]);

  const toggleArrayItem = (setter, item) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        birthDate,
        sensoryPreferences,
        supportNeeds,
        notes
      };

      if (childToEdit) {
        await childProfileService.updateChild(childToEdit._id, payload);
        success('Child profile updated successfully');
      } else {
        await childProfileService.createChild(payload);
        success('Child profile created successfully');
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save child profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={childToEdit ? `Edit Profile: ${childToEdit.name}` : 'Add Child Profile'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Child's Name or Nickname"
          id="child-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Leo"
          required
        />

        <div>
          <Input
            label="Date of Birth"
            id="child-dob"
            type="date"
            value={birthDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setBirthDate(e.target.value)}
            helperText="Age and developmental age group are authoritatively derived by the system from the birth date."
            required
          />
        </div>

        {/* Sensory Preferences Checkboxes */}
        <fieldset className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
          <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 px-1">
            Sensory Sensitivities & Preferences
          </legend>
          <div className="mt-2 space-y-2">
            {SENSORY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={sensoryPreferences.includes(opt.value)}
                  onChange={() => toggleArrayItem(setSensoryPreferences, opt.value)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Support Needs Checkboxes */}
        <fieldset className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
          <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 px-1">
            Therapy & Accessibility Support Needs
          </legend>
          <div className="mt-2 space-y-2">
            {SUPPORT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={supportNeeds.includes(opt.value)}
                  onChange={() => toggleArrayItem(setSupportNeeds, opt.value)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="child-notes" className="block text-sm font-semibold text-slate-700 mb-1">
            Private Caregiver Notes (Optional)
          </label>
          <textarea
            id="child-notes"
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special calming routines, favorite sensory objects, communication cues..."
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          ></textarea>
          <p className="text-[11px] text-slate-500 mt-1">
            Strictly private: Only you and authorized admins have access. Never exposed to other parents or organizations.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {childToEdit ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
