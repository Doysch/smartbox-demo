import React, { useEffect, useState } from "react";
import { algoliasearch } from "algoliasearch";
import { useInstantSearch } from "react-instantsearch";
import { useIsMobile } from "../hooks/useIsMobile";

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

const personaToExp = {
  "Thrill Seeker": 'categories.lvl0:"Adventure"',
  "Foodie": 'categories.lvl1:"Gastronomy > Michelin"',
  "Wellness Seeker": 'categories.lvl0:"Stay Wellness"',
};

export default function TrendingItems({ persona }) {
  const isMobile = useIsMobile(); // hook for mobile detection

  const { uiState } = useInstantSearch();
  const [trendingHits, setTrendingHits] = useState([]);

  const currentState = uiState?.[indexName] || {};
  const query = currentState.query || "";
  // const ruleContexts = currentState.ruleContexts || [];
  // const hasPersona = ruleContexts.some((ctx) => ctx.startsWith("persona-"));

  useEffect(() => {
    if (isMobile || query.trim() !== "") return;

    // Clear old hits while we fetch new ones
    setTrendingHits([]);

    // Build filters string only when a persona exists
    const filters = persona ? personaToExp[persona] : undefined;

    // console.log({ persona, filters, query, isMobile });

    // add persona-specific fallback

const fallback =
  persona === 'Wellness Seeker'
    ? { filters: 'categories.lvl1:"Stay Wellness > Spa"' }
  : persona === 'Foodie'
    ? { filters: 'categories.lvl0:"Gastronomy"' }
  : {};

    recommendClient
      .getRecommendations({
        requests: [
          {
            indexName: "smartbox_boxes_CH-fr",
            model: "trending-items",
            maxRecommendations: 5,
            threshold: 0,
            queryParameters: filters ? { filters } : {},
            fallbackParameters: fallback
          },
        ],
      })
      .then((res) => {
        // console.log("Trending hits:", res);
        setTrendingHits(res.results[0].hits || []);
      })
      .catch((err) => {
        console.error("Error fetching trending items:", err);
      });
  }, [query, persona, isMobile]);

  if (query.trim() !== "" || !trendingHits.length) return null;

  return (
    <section className="trending-section">
      <h2 className="trending-title">✨ Recommandé pour vous ✨</h2>

      <div className="trending-carousel-wrapper">
        {/* <button className="carousel-arrow" disabled>
          ←
        </button> */}

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
                </p>
                {rating && (
                  <p className="trending-rating">⭐ {Math.round(rating)}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* <button className="carousel-arrow" disabled>
          →
        </button> */}
      </div>
    </section>
  );
}
