import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const SuccessStoryHero = () => {
  return (
    <section 
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-br from-teal-50/80 via-white to-sky-50/70 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Copy & Context */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-bold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
              <span>Inspiring Journeys</span>
            </div>

            <h1 
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900"
            >
              Success Stories
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-teal-900 leading-snug">
              Real people. Remarkable journeys. Different ways of making an impact.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Explore stories of people who have publicly shared their experiences with autism and gone on to make meaningful contributions across science, arts, entertainment, advocacy, technology, and other fields.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" aria-hidden="true"></span>
                Factually Documented Disclosures
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" aria-hidden="true"></span>
                Reliably Sourced Biographies
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
                Dignity-Centered Language
              </span>
            </div>
          </div>

          {/* Right: Visual Card with Mountain Landscape & Inspiring Callout */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-teal-100/80 bg-white group">
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/success_hero_banner.jpg"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Callout Quote Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-5">
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/60 max-w-xs">
                  <p className="font-serif italic text-teal-950 text-base sm:text-lg font-bold leading-tight">
                    “Different minds build a brighter world”
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-teal-100 text-xs text-teal-700 font-medium">
                    <span>A celebration of neurodiversity</span>
                    <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-500" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
