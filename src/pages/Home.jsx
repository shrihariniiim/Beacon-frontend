import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { ResourceCard } from '../components/cards/ResourceCard';
import { ReportModal } from '../components/modals/ReportModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  Search,
  BookOpen,
  Calendar,
  IndianRupee,
  Heart,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Report Modal State
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await resourceService.getResources({ limit: 4, verifiedOnly: true });
        setFeaturedResources(res.data || []);
      } catch (err) {
        console.error('Failed to load featured resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/resources');
    }
  };

  const categories = [
    { name: 'Educational Toolkits', count: 'Classroom & Home', icon: BookOpen, path: '/resources?category=EDUCATIONAL' },
    { name: 'Therapy & AAC', count: 'Speech, OT & Sensory', icon: Sparkles, path: '/resources?category=THERAPY_SUPPORT' },
    { name: 'Government Schemes', count: 'UDID, Benefits & ADIP', icon: ShieldCheck, path: '/resources?category=GOVERNMENT_SCHEME' },
    { name: 'Sensory Events', count: 'Low-Stimulation Circles', icon: Calendar, path: '/events' },
    { name: 'Financial Aid', count: 'Grants & Subsidies', icon: IndianRupee, path: '/financial-aid' },
    { name: 'Caregiver Support', count: 'Peer Respite & Mental Health', icon: Heart, path: '/resources?category=PARENT_SUPPORT' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-800/60 border border-teal-700/80 text-teal-200 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-teal-300" aria-hidden="true" />
            <span>Verified Social Impact & Caregiver Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Connecting Caregivers with <span className="text-teal-400">Verified Support</span> & Inclusive Opportunities
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover sensory-friendly learning toolkits, accredited NGO services, official government welfare schemes, community events, and financial-aid opportunities.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sensory guides, speech therapy, grants..."
                aria-label="Search resources, events, or financial aid"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
            >
              Search Resources
            </button>
          </form>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" aria-hidden="true" />
              Accredited NGOs & Govt Bodies
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" aria-hidden="true" />
              Zero AI / Deterministic Matching
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" aria-hidden="true" />
              WCAG 2.1 AA Accessible
            </span>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Support Category</h2>
            <p className="text-sm text-slate-600 mt-1">
              Curated directories for neurodiversity, sensory sensitivities, and developmental support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex items-start gap-4 group focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors flex-shrink-0">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Verified & Audited</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Recently Published Resources</h2>
            <p className="text-sm text-slate-600 mt-1">
              Each resource has been verified through our administrative moderation workflow.
            </p>
          </div>
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-900 focus:outline-none focus:underline"
          >
            View All Resources <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredResources.map((res) => (
              <ResourceCard
                key={res._id}
                resource={res}
                onReport={(type, id, title) => setReportData({ type, id, title })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Verification Workflow Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-teal-400 text-xs font-extrabold uppercase tracking-widest">
              Trust & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              How Organization Verification Works
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              To protect caregivers, every NGO and Government department must register, submit formal registration documents, and pass manual review by our administration team. Only verified organizations are unlocked to submit public resources.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Register Your Organization
              </Link>
              <Link
                to="/accessibility"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Accessibility Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {reportData && (
        <ReportModal
          isOpen={!!reportData}
          onClose={() => setReportData(null)}
          contentType={reportData.type}
          contentId={reportData.id}
          contentTitle={reportData.title}
        />
      )}
    </div>
  );
};
