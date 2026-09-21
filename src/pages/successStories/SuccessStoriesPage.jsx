import React, { useState, useMemo } from 'react';
import { SuccessStoryHero } from '../../components/successStories/SuccessStoryHero';
import { SuccessStoryFilters } from '../../components/successStories/SuccessStoryFilters';
import { SuccessStoryCard } from '../../components/successStories/SuccessStoryCard';
import { SuccessStoryEmptyState } from '../../components/successStories/SuccessStoryEmptyState';
import { successStories } from '../../data/successStories';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export const SuccessStoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Compute category counts
  const countsByCategory = useMemo(() => {
    const counts = { All: successStories.length };
    successStories.forEach((story) => {
      story.categories.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Filter stories based on selected category
  const filteredStories = useMemo(() => {
    if (selectedCategory === 'All') {
      return successStories;
    }
    return successStories.filter((story) =>
      story.categories.includes(selectedCategory)
    );
  }, [selectedCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE) || 1;
  const paginatedStories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStories, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Hero Section */}
      <SuccessStoryHero />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        
        {/* Category Filter Navigation */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Explore by Field
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Filter verified public figures by domain of contribution
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredStories.length}</span> {filteredStories.length === 1 ? 'story' : 'stories'}
            </div>
          </div>

          <SuccessStoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            countsByCategory={countsByCategory}
          />
        </div>

        {/* Stories Grid / Empty State */}
        {filteredStories.length === 0 ? (
          <SuccessStoryEmptyState onReset={() => handleCategoryChange('All')} />
        ) : (
          <>
            {/* 4-Column Responsive Grid matching the Reference Design */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              role="region"
              aria-label="Success stories list"
            >
              {paginatedStories.map((story) => (
                <SuccessStoryCard key={story.id} story={story} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav 
                aria-label="Stories pagination"
                className="mt-12 flex items-center justify-center gap-1.5"
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                  const isCurrent = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`w-9 h-9 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                        isCurrent
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        )}

        {/* Educational Note & Disclaimer (Section 13) */}
        <section 
          aria-labelledby="disclaimer-heading"
          className="mt-16 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
              <Info className="w-5 h-5" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h3 
                id="disclaimer-heading"
                className="text-base sm:text-lg font-bold text-slate-900"
              >
                Every autistic experience is different
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                These stories represent individual experiences and should not be interpreted as representative of every autistic person. Autism is a spectrum, and people can have very different strengths, challenges, support needs, and life experiences.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                BeaconCare presents curated profiles strictly based on reliable public disclosures, authentic source citations, and respectful dignity-centered editorial standards.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
