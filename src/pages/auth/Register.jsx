import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ShieldCheck, UserPlus, Info } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('PARENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Organization fields
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role
      };

      if (role === 'NGO' || role === 'GOVERNMENT') {
        payload.organizationData = {
          name: orgName,
          description: orgDescription,
          address: {
            city: orgCity || 'Default City',
            state: orgState || 'Default State'
          }
        };
      }

      const user = await register(payload);
      success('Account created successfully!');

      if (user.role === 'NGO' || user.role === 'GOVERNMENT') {
        navigate('/organization/verification');
      } else {
        navigate('/parent/dashboard');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Join the BeaconCare Network
          </h1>
          <p className="text-sm text-slate-600">
            Create an account to connect with verified caregiver resources
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Select Account Type"
              id="account-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'PARENT', label: 'Parent / Primary Caregiver' },
                { value: 'NGO', label: 'Non-Governmental Organization (NGO)' },
                { value: 'GOVERNMENT', label: 'Government Welfare Directorate' }
              ]}
              required
            />

            {role !== 'PARENT' && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
                  Verification Required for Official Publishing
                </p>
                <p className="text-amber-700 leading-relaxed">
                  Organization accounts start with <strong>PENDING</strong> status. You must upload formal registration credentials in your portal before public resources can be verified.
                </p>
              </div>
            )}

            <Input
              label={role === 'PARENT' ? 'Full Name' : 'Authorized Representative Name'}
              id="register-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
            />

            <Input
              label="Official Email Address"
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.org"
              required
            />

            <Input
              label="Password (min. 8 characters)"
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* Additional fields for Organizations */}
            {role !== 'PARENT' && (
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Organization Details
                </h2>

                <Input
                  label="Official Organization Name"
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Coimbatore Child Development Society"
                  required
                />

                <div>
                  <label htmlFor="org-desc" className="block text-sm font-semibold text-slate-700 mb-1">
                    Organization Mission & Activities <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="org-desc"
                    rows="3"
                    required
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Briefly describe your services, therapy facilities, or welfare focus..."
                    className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    id="org-city"
                    value={orgCity}
                    onChange={(e) => setOrgCity(e.target.value)}
                    placeholder="e.g. Coimbatore"
                    required
                  />
                  <Input
                    label="State"
                    id="org-state"
                    value={orgState}
                    onChange={(e) => setOrgState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 focus:outline-none focus:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
