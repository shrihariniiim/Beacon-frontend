import React from 'react';
import { ShieldCheck, CheckCircle2, Eye, Keyboard, Volume2 } from 'lucide-react';

export const AccessibilityStatement = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <ShieldCheck className="w-4 h-4 text-teal-700" aria-hidden="true" />
          <span>WCAG 2.1 Level AA Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          BeaconCare Accessibility Statement
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          At BeaconCare, accessibility is not an optional feature or an afterthought — it is a core foundational product requirement. We are committed to ensuring digital accessibility for parents, caregivers, and individuals with disabilities.
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-teal-700" aria-hidden="true" />
            Full Keyboard Navigation
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The entire primary application is fully operable using standard keyboard controls without requiring a pointing device:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li><strong>Tab / Shift + Tab:</strong> Moves focus sequentially through interactive links, buttons, and form inputs.</li>
            <li><strong>Enter / Space:</strong> Activates buttons, toggles checkboxes, and opens modal dialogs.</li>
            <li><strong>Escape:</strong> Closes all open modal dialogs and dropdown menus, returning focus to the triggering element.</li>
            <li><strong>Skip Link:</strong> An accessible skip-to-main-content link is present at the top of every page for rapid keyboard navigation.</li>
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-700" aria-hidden="true" />
            Visual Contrast & Focus Indicators
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All text and interactive controls maintain high color contrast ratios meeting or exceeding WCAG 2.1 AA standards (minimum 4.5:1 for normal text and 3:1 for large text and UI components).
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every interactive control features a prominent, unclipped 2px teal focus ring (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">:focus-visible</code>) to ensure clear navigational context.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-teal-700" aria-hidden="true" />
            Screen Reader Compatibility & Semantic HTML
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            BeaconCare avoids non-semantic clickable <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;div&gt;</code> elements, relying on semantic <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;button&gt;</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;a&gt;</code> elements with clear, descriptive accessible names.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Form inputs are explicitly associated with persistent <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&lt;label&gt;</code> elements and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">aria-describedby</code> error text.</li>
            <li>Dynamic notifications utilize <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">aria-live="polite"</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">role="status"</code> for screen reader announcement without interruptive disruption.</li>
            <li>Dialogs enforce <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">aria-modal="true"</code>, focus containment traps, and background scroll locking.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
