import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ShieldCheck, Lock, Mail, Users } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      success(`Welcome back, ${user.name}!`);

      // Role based smart redirect
      if (from !== '/') {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'NGO' || user.role === 'GOVERNMENT') {
        navigate('/organization/dashboard', { replace: true });
      } else {
        navigate('/parent/dashboard', { replace: true });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to BeaconCare
          </h1>
          <p className="text-sm text-slate-600">
            Access your caregiver tools or organization portal
          </p>
        </div>

        {/* Demo Quick Logins for Evaluators */}
        <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            Quick Demo Accounts (1-Click Autofill):
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('parent.demo@beaconcare.org', 'Password123!')}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-left hover:bg-teal-50 hover:border-teal-300 font-medium transition-colors"
            >
              👩‍👦 Parent Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('priya@auracare.org', 'Password123!')}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-left hover:bg-teal-50 hover:border-teal-300 font-medium transition-colors"
            >
              🏥 NGO Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('director.socialwelfare@gov.in', 'Password123!')}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-left hover:bg-teal-50 hover:border-teal-300 font-medium transition-colors"
            >
              🏛️ Government Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@beaconcare.org', 'Password123!')}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-left hover:bg-teal-50 hover:border-teal-300 font-medium transition-colors"
            >
              🛡️ Admin Officer
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-700 hover:text-teal-900 focus:outline-none focus:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
