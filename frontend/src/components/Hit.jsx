import React from "react";
import { Star } from "lucide-react";

const Hit = ({ hit, onBoxClick }) => {
  const rating = hit.average_rating;
  const reviews = hit.review_count;
  const imageUrl = hit.listingImage;
  const title = hit.webTitle;
  let experienceMeta = "";

  try {
    const components = JSON.parse(
      hit.experiences?.[0]?.experienceComponents || "[]"
    );
    experienceMeta = components[0];
  } catch (err) {
    experienceMeta = "1 activité pour 1 ou 2 personnes";
  }
  const activityText = experienceMeta || "1 activité pour 1 ou 2 personnes";

  return (
    <div
      className="hit-card"
      onClick={() => onBoxClick?.(hit)} 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onBoxClick?.(hit)} 
    >
      <div
        className="hit-image-wrapper"
        style={{ backgroundImage: `url(${imageUrl || hit.lengowImage || ""})` }}
      />
      <div className="hit-info">
        <h2 className="hit-title">{title || hit.boxName}</h2>

        {/* Rating stars and count */}
        {rating && (
          <div className="hit-rating">
            {Array.from({ length: 5 }).map((_, i) => {
              const diff = rating - i;

              if (diff >= 0.75) {
                // Full star
                return (
                  <Star key={i} size={16} color="#f7b500" fill="#f7b500" />
                );
              } else if (diff >= 0.25) {
                // Half star
                return (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id={`half-grad-${i}`}>
                        <stop offset="50%" stopColor="#f7b500" />
                        <stop offset="50%" stopColor="#fff" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#half-grad-${i})`}
                      stroke="#ccc"
                      strokeWidth="1"
                      d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 
                 1.4 8.175L12 18.897l-7.334 3.869 
                 1.4-8.175L.132 9.209l8.2-1.191z"
                    />
                  </svg>
                );
              } else {
                // Empty star
                return (
                  <Star
                    key={i}
                    size={16}
                    color="#fff"
                    stroke="#ccc"
                    fill="none"
                  />
                );
              }
            })}
            <span className="hit-rating-count">{reviews}</span>
          </div>
        )}

        {/* activity indo */}
        <div className="hit-meta">
          <div className="hit-meta-item people-icon">
            <img
              src="/icons/users.svg"
              alt="people icon"
              width={16}
              height={16}
            />
            <span>{activityText}</span>
          </div>
        </div>

        {/* Price */}
        <div className="hit-price">{hit.price} €</div>
      </div>
    </div>
  );
};

export default Hit;
