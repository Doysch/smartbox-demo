// src/components/TrendingItems.jsx
import React, { useEffect, useState, useRef } from "react";
import { algoliasearch } from "algoliasearch";
import { useInstantSearch } from "react-instantsearch";

// 🔐 Init Recommend manually
const recommendClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_RECOMMEND_API_KEY
).initRecommend();

const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

function truncateTitle(title, wordLimit = 4) {
  const words = title.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : title;
}

export default function TrendingItems() {
  const [trendingHits, setTrendingHits] = useState([]);
  const { uiState } = useInstantSearch();
const query = uiState?.[indexName]?.query || "";

  useEffect(() => {
    if (query.trim() !== "") return;

    recommendClient
      .getRecommendations({
        requests: [
          {
            indexName: "smartbox_boxes_CH-fr",
            model: "trending-items",
            maxRecommendations: 5,
            threshold: 0,
            facetName: "categoryPageId",
            facetValue: "Wellness",
            fallbackParameters: {
              facetFilters: [["categoryPageId:Wellness"]],
            },
          },
        ],
      })
      .then((res) => {
        console.log("🔥 Trending hits response:", res);
        setTrendingHits(res.results[0].hits || []);
      })
      .catch((err) => {
        console.error("❌ Error fetching trending items:", err);
      });
  }, [query]);

  if (query.trim() !== "" || !trendingHits.length) return null;

  return (
    <section className="trending-section">
      <h2 className="trending-title">✨ Recommandé pour vous</h2>

      <div className="trending-carousel-wrapper">
        <button className="carousel-arrow" disabled>
          ←
        </button>

        <div className="trending-carousel">
          {trendingHits.map((hit) => {
            const rating = !isNaN(parseFloat(hit.experienceRating))
              ? parseFloat(hit.experienceRating)
              : !isNaN(parseFloat(hit.average_rating))
              ? parseFloat(hit.average_rating)
              : null;

            return (
              <div className="trending-card" key={hit.objectID}>
                <img
                  src={hit.listingImage || hit.lengowImage}
                  alt={hit.webTitle}
                  className="trending-image"
                />
                <p className="trending-box-title">
                  {truncateTitle(hit.webTitle)}
                </p>{" "}
                {rating && (
                  <p className="trending-rating">⭐ {Math.round(rating)}</p>
                )}
              </div>
            );
          })}
        </div>

        <button className="carousel-arrow" disabled>
          →
        </button>
      </div>
    </section>
  );
}
