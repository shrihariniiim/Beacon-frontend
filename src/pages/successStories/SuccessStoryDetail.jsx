import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { successStories } from '../../data/successStories';
import { 
  ArrowLeft, 
  ExternalLink, 
  Quote, 
  Award, 
  BookOpen, 
  Compass, 
  CheckCircle2, 
  Sparkles,
  User,
  ChevronRight
} from 'lucide-react';

export const SuccessStoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const story = successStories.find((item) => item.id === id);

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Story Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            The story profile you requested could not be found or may have been relocated.
          </p>
          <Link
            to="/success-stories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Return to Success Stories</span>
          </Link>
        </div>
      </div>
    );
  }

  // Get other stories for recommendation carousel/list
  const otherStories = successStories
    .filter((item) => item.id !== story.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Breadcrumbs Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm text-slate-500">
            <Link to="/" className="hover:text-teal-700 transition-colors focus:outline-none focus:underline">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" aria-hidden="true" />
            <Link to="/success-stories" className="hover:text-teal-700 transition-colors focus:outline-none focus:underline">
              Success Stories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" aria-hidden="true" />
            <span className="font-semibold text-slate-900 truncate" aria-current="page">
              {story.name}
            </span>
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/success-stories')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-sm p-1"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to all stories</span>
          </button>
        </div>

        {/* Profile Header Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Image Col */}
            <div className="md:col-span-5 relative bg-slate-100 min-h-[280px] sm:min-h-[340px]">
              {!imageError ? (
                <img
                  src={story.image}
                  alt={story.imageAlt}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-teal-50 text-teal-700 p-6">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-teal-600" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-bold text-teal-900">{story.name}</span>
                </div>
              )}
            </div>

            {/* Header Details Col */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    {story.primaryCategory}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    Verified Public Disclosure
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {story.name}
                </h1>

                <p className="text-base sm:text-lg font-semibold text-teal-700 mt-1">
                  {story.field}
                </p>

                <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                  {story.shortDescription}
                </p>
              </div>

              {/* Quote Highlight */}
              {story.quote && (
                <div className="bg-teal-50/70 border border-teal-100/90 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Quote className="w-5 h-5 text-teal-500 shrink-0 mt-0.5 fill-teal-500/20" aria-hidden="true" />
                    <div>
                      <p className="font-serif italic text-teal-950 text-sm sm:text-base font-semibold leading-relaxed">
                        “{story.quote}”
                      </p>
                      {story.quoteSource && (
                        <p className="text-[11px] text-teal-700 font-medium mt-1">
                          — {story.quoteSource}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Deep Dive Sections Grid */}
        <div className="space-y-8">
          
          {/* Section 1: Autism Disclosure & Public Documentation */}
          <section 
            aria-labelledby="disclosure-heading"
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 id="disclosure-heading" className="text-lg sm:text-xl font-bold text-slate-900">
                Public Autism Disclosure & Experience
              </h2>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {story.autismDisclosure}
            </p>
          </section>

          {/* Section 2: Career & Notable Contributions */}
          <section 
            aria-labelledby="career-heading"
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 id="career-heading" className="text-lg sm:text-xl font-bold text-slate-900">
                Career & Notable Achievements
              </h2>
            </div>

            <ul className="space-y-3">
              {story.achievements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0" aria-hidden="true"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Journey & Perspectives */}
          <section 
            aria-labelledby="journey-heading"
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Compass className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 id="journey-heading" className="text-lg sm:text-xl font-bold text-slate-900">
                Their Journey
              </h2>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {story.journey}
            </p>
          </section>

          {/* Section 4: Sources & Further Reading */}
          <section 
            aria-labelledby="sources-heading"
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 id="sources-heading" className="text-lg sm:text-xl font-bold text-slate-900">
                Sources & Further Reading
              </h2>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              All information presented is backed by public interviews, author publications, and institutional archives:
            </p>

            <div className="space-y-2.5">
              {story.sources.map((source, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {source.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Publisher: {source.publisher}
                    </p>
                  </div>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-sm p-1"
                  >
                    <span>View Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Discover More Stories Section */}
        <section aria-labelledby="more-stories-heading" className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 id="more-stories-heading" className="text-xl font-bold text-slate-900">
              Discover More Journeys
            </h2>
            <Link
              to="/success-stories"
              className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors focus:outline-none focus:underline"
            >
              View all stories →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherStories.map((other) => (
              <div 
                key={other.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {other.primaryCategory}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mt-1">
                    {other.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {other.field}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {other.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <Link
                    to={`/success-stories/${other.id}`}
                    className="text-xs font-semibold text-teal-700 group-hover:text-teal-900 transition-colors inline-flex items-center gap-1 focus:outline-none focus:underline"
                  >
                    <span>Read Story</span>
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
