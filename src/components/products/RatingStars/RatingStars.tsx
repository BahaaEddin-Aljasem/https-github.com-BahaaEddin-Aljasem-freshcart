interface RatingStarsProps {
  average: number;
  count: number;
  size?: "card" | "detail";
}

const starPath = "M50 2 62 37 98 38 69 60 80 96 50 75 20 96 31 60 2 38 38 37Z";
const starFacetPath = "M50 47 98 38 69 60 80 96 50 75Z";

export function RatingStars({ average, count, size = "card" }: RatingStarsProps) {
  const rating = Number.isFinite(average) ? Math.min(5, Math.max(0, average)) : 0;
  const hasRatings = count > 0 && rating > 0;
  const starSize = size === "card" ? "size-5 sm:size-6" : "size-4";
  const labelClass = size === "card" ? "text-base" : "text-xs text-slate-500";

  return (
    <div className="flex items-center gap-2 text-slate-500">
      <div
        role="img"
        className="flex items-center gap-0.5"
        aria-label={hasRatings ? `${rating.toFixed(1)} out of 5 stars from ${count} reviews` : "No reviews yet"}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const fillPercent = Math.min(1, Math.max(0, rating - index)) * 100;
          return (
            <span key={index} className={`relative shrink-0 ${starSize}`}>
              <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
                <path d={starPath} fill="#e5e7eb" />
              </svg>
              {fillPercent > 0 && (
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 size-full"
                  style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
                  aria-hidden
                >
                  <path d={starPath} fill="#ffe600" />
                  <path d={starFacetPath} fill="#f5a700" />
                </svg>
              )}
            </span>
          );
        })}
      </div>
      <span className={labelClass}>{hasRatings ? `${rating.toFixed(1)} (${count})` : "No reviews"}</span>
    </div>
  );
}
