import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Mission & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight">BeaconCare</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A trusted, accessibility-first network connecting families, caregivers, and children with sensory, developmental, and healthcare needs to verified organizations, official government welfare schemes, and community support.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Independent verification workflow with strict moderation.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Explore Network
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Verified Resources
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Sensory-Friendly Events
                </Link>
              </li>
              <li>
                <Link to="/financial-aid" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Financial Aid & Schemes
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Organization Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Accessibility & Trust */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Accessibility & Ethics
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs block leading-relaxed">
                  Engineered to WCAG 2.1 AA guidelines. Zero AI or opaque algorithmic ranking. Deterministic matching based strictly on explicit family preferences.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} BeaconCare Platform. Built for verified social impact.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/accessibility" className="hover:text-slate-300 underline">
              WCAG AA Accessibility
            </Link>
            <span>&bull;</span>
            <span>Privacy-Safe Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
