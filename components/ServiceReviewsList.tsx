"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquareQuote, CheckCircle2, Loader2 } from "lucide-react";

interface Review {
  id: string;
  _id?: string;
  customerName: string;
  customerImage?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ServiceReviewsListProps {
  serviceId: string;
}

export default function ServiceReviewsList({ serviceId }: ServiceReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fix-mate-server-teal.vercel.app";
        const res = await fetch(`${apiUrl}/api/services/${serviceId}/reviews`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load reviews (${res.status})`);
        }
        const data = await res.json();
        if (active) {
          setReviews(data.data || []);
          setTotalReviews(data.total || 0);
          if (data.total > 0 && data.averageRating) {
            setAverageRating(data.averageRating);
          }
        }
      } catch (err: unknown) {
        if (active) {
          const e = err as { message?: string };
          setError(e.message || "Unable to load customer reviews");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (serviceId) {
      fetchReviews();
    }

    return () => {
      active = false;
    };
  }, [serviceId, refreshKey]);

  return (
    <div className="rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE5DF] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-[#18756B]" />
            <h2 className="text-lg font-bold text-[#152C2B]">Customer Reviews & Ratings</h2>
          </div>
          <p className="text-xs text-[#526564] mt-0.5">
            Verified post-repair feedback from real clients.
          </p>
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center gap-3 bg-[#F6F5EF] px-4 py-2.5 rounded-2xl border border-[#DCE5DF]">
            <div className="text-2xl font-black text-[#152C2B]">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      s <= Math.round(averageRating)
                        ? "fill-[#F4B740] text-[#F4B740]"
                        : "text-[#DCE5DF]"
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] font-semibold text-[#526564]">
                {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#18756B]" />
        </div>
      ) : error ? (
        <div className="py-6 text-center space-y-2 bg-rose-50/60 rounded-2xl border border-rose-200 p-4">
          <h3 className="text-xs font-bold text-rose-800">Reviews Unavailable</h3>
          <p className="text-[11px] text-rose-600 max-w-sm mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="text-xs font-bold text-[#18756B] hover:underline cursor-pointer"
          >
            Retry Loading Reviews
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center space-y-2 bg-[#F6F5EF]/40 rounded-2xl border border-dashed border-[#DCE5DF]">
          <Star className="h-8 w-8 text-[#526564]/30 mx-auto" />
          <h3 className="text-xs font-bold text-[#152C2B]">No customer reviews yet</h3>
          <p className="text-[11px] text-[#526564] max-w-sm mx-auto">
            Book this repair service to be the first verified customer to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-[#DCE5DF]/60">
          {reviews.map((r, idx) => {
            const id = r.id || r._id || `review-${idx}`;
            return (
              <div key={id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {r.customerImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={r.customerImage}
                        alt={r.customerName}
                        className="h-8 w-8 rounded-full object-cover border border-[#DCE5DF]"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#18756B] text-white flex items-center justify-center font-bold text-xs">
                        {r.customerName?.[0] || "C"}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#152C2B]">{r.customerName}</span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span>Verified Job</span>
                        </span>
                      </div>
                      <div className="text-[10px] text-[#526564]">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= r.rating ? "fill-[#F4B740] text-[#F4B740]" : "text-[#DCE5DF]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#526564] leading-relaxed pl-10">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
