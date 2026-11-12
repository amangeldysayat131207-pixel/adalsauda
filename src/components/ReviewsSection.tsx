import { Star, ShieldCheck, MessageSquare, Quote } from 'lucide-react';
import { Review } from '../types';
import { Language, t } from '../i18n/translations';

interface ReviewsSectionProps {
  reviews: Review[];
  lang: Language;
  onOpenReviewModal: () => void;
}

export function ReviewsSection({ reviews, lang, onOpenReviewModal }: ReviewsSectionProps) {
  const currentT = t[lang];

  return (
    <section id="reviews" className="py-14 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              {lang === 'kz' ? 'Сенімділік белгісі' : 'Знак доверия'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentT.reviewsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {currentT.reviewsSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-amber-500 font-extrabold text-lg">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-slate-900 dark:text-white tabular-nums">4.9 / 5.0</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {currentT.ratingScore}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenReviewModal}
              className="py-3 px-4.5 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-colors whitespace-nowrap shadow-md ml-2"
            >
              {currentT.writeReview}
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                {/* Rating stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                </div>

                {/* Comment quote */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{lang === 'kz' ? rev.commentKz : rev.commentRu}"
                </p>
              </div>

              {/* Author & Restaurant info */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.authorName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {rev.authorRole} · {rev.restaurantName}
                  </div>
                </div>

                {rev.verifiedBuyer && (
                  <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600" title={currentT.verifiedRestaurateur}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
