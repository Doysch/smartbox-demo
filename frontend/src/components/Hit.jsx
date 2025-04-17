// src/components/Hit.jsx
import React from 'react';
import { Star, Users, MapPin, Truck, Tag } from "lucide-react";

const Hit = ({ hit }) => {
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
    <div className="hit-card">
      <div
        className="hit-image-wrapper"
        style={{ backgroundImage: `url(${imageUrl || hit.lengowImage || ""})` }}
      />
      <div className="hit-info">
        <h2 className="hit-title">{title || hit.boxName}</h2>

        {/* Rating stars and count */}
        {rating && (
          <div className="hit-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                color={i < Math.round(rating) ? "#f7b500" : "#ccc"}
                fill={i < Math.round(rating) ? "#f7b500" : "none"}
              />
            ))}
            <span className="hit-rating-count">{reviews}</span>
          </div>
        )}

        {/* Meta info (people / location / delivery) */}
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