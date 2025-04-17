import React from "react";
import { algoliasearch } from "algoliasearch";
import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch";
import "./App.css";
import smartboxLogo from "./images/smartbox-logo.png";
import { Star, Users, MapPin, Truck, Tag } from "lucide-react";
import { useHits } from "react-instantsearch";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

function CustomHits() {
  const { hits } = useHits();

  return (
    <div className="hits-container">
      {hits.map((hit) => (
        <Hit key={hit.objectID} hit={hit} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <header className="search-header">
          <div className="logo">
            <img src={smartboxLogo} alt="Smartbox Logo" />
          </div>

          <div className="search-wrapper">
            <SearchBox
              placeholder="2 nuits, Parachute, Insolite ..."
              classNames={{
                root: "searchbox-root",
                input: "searchbox-input",
                submit: "searchbox-submit",
                reset: "searchbox-reset",
              }}
            />
          </div>

          <div className="nav-icons">
            <div className="nav-item">
              <span className="icon">🎟️</span>
              <span>Enregistrez</span>
            </div>
            <div className="nav-item">
              <span className="icon">👤</span>
              <span>Me connecter</span>
            </div>
            <div className="nav-item">
              <span className="icon">🛒</span>
              <span>Panier</span>
            </div>
          </div>
        </header>

        <main className="hits-container">
          <CustomHits />
        </main>

        <Configure hitsPerPage={12} />
      </InstantSearch>
    </div>
  );
}

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
