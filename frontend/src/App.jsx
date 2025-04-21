import React, { useState, useEffect, useRef } from "react";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  Configure,
  Pagination,
  Stats,
  SortBy,
} from "react-instantsearch";
import "./App.css";
import smartboxLogo from "./images/smartbox-logo.png";
import { useHits } from "react-instantsearch";
import Hit from "./components/Hit";
import BoxModal from "./components/BoxModal";
import RefinementPanel from "./components/RefinementPanel";
import { Link } from "react-router-dom";
import ExperienceDropdown from "./components/ExperienceDropdown";
import OccasionsDropdown from "./components/OccasionsDropdown";
import DestinationsDropdown from "./components/DestinationsDropdown";
import CategoryDropdown from "./components/CategoryDropdown";
import PersonaDropdown from "./components/PersonaDropdown";
import PlatformDropdown from "./components/PlatformDropdown";
import { history } from "instantsearch.js/es/lib/routers";
import { singleIndex } from "instantsearch.js/es/lib/stateMappings";
import SearchWrapper from "./components/SearchWrapper";
import TrendingItems from "./components/TrendingItems";
import { useIsMobile } from "./hooks/useIsMobile";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

function CustomHits() {
  const { hits } = useHits();
  const [selectedBox, setSelectedBox] = useState(null);
  return (
    <>
      <div className="hits-container">
        {hits.map((hit) => (
          <Hit key={hit.objectID} hit={hit} onBoxClick={setSelectedBox} />
        ))}
      </div>
      <BoxModal box={selectedBox} onClose={() => setSelectedBox(null)} />
    </>
  );
}

export default function App() {
  const [persona, setPersona] = useState("");
  const [platform, setPlatform] = useState("");
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(() => !isMobile);
  const logoClickHandlerRef = useRef(null);

  const personaToFilterMap = {
    "Thrill Seeker": "Adventure",
    Foodie: "Gastronomy",
    "Wellness Seeker": "Stay Wellness",
    Stay: "Stay",
  };

  const personaToContextMap = {
    "Thrill Seeker": "thrill-seeker",
    Foodie: "foodie",
    "Wellness Seeker": "wellness-seeker",
    Stay: "stay",
  };

  const handleLogoClick = () => {
    if (logoClickHandlerRef.current) {
      logoClickHandlerRef.current(); // Reset the query
    }
  };

  return (
    <div className="app-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        routing={{ router: history(), stateMapping: singleIndex(indexName) }}
      >
        <header className="search-header">
          <Link to="/" className="logo" onClick={handleLogoClick}>
            <img src={smartboxLogo} alt="Smartbox Logo" />
          </Link>

          <div className="search-wrapper">
            <SearchWrapper
              onLogoClick={(cb) => (logoClickHandlerRef.current = cb)}
            />
          </div>
{/* Nav section */}
          <div className="nav-group">
            <div className="nav-icons">
              <div className="nav-item">
                <span className="icon">👤</span>
                <span>Me connecter</span>
              </div>
              <div className="nav-item">
                <span className="icon">🛒</span>
                <span>Panier</span>
              </div>
            </div>
            <PersonaDropdown onChange={setPersona} />
          </div>

          <PlatformDropdown onChange={setPlatform} />
        </header>

{/* Trending Items & Category dropdowns */}
        {<TrendingItems />}

        <div className="dropdowns-row">
          <CategoryDropdown />
          <ExperienceDropdown />
          <OccasionsDropdown />
          <DestinationsDropdown />
        </div>

        <main className="main-content">
          {isMobile ? (
            <div className="refinement-toggle-wrapper">
              <button
                className="toggle-filters-btn secondary-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </button>
              {showFilters && <RefinementPanel />}
            </div>
          ) : (
            <RefinementPanel />
          )}
{/* Sort by & Hits */}
          <div className="content-area">
            <div className="results-header">
              <Stats
                translations={{
                  rootElementText({ nbHits, processingTimeMS }) {
                    return `Résultats ${nbHits.toLocaleString(
                      "fr-FR"
                    )}, trouvés en ${processingTimeMS}ms`;
                  },
                }}
              />
              <SortBy
                items={[
                  { label: "Pertinence", value: indexName },
                  {
                    label: "Prix croissant",
                    value: `${indexName}_price_asc`,
                  },
                  {
                    label: "Prix décroissant",
                    value: `${indexName}_price_desc`,
                  },
                  {
                    label: "Meilleures notes",
                    value: `${indexName}_rating_desc`,
                  },
                ]}
                defaultRefinement={indexName}
              />
            </div>
            <CustomHits />
            <Pagination />
          </div>
        </main>

        <Configure
          hitsPerPage={12}
          getRankingInfo={true}
          enablePersonalization
          personalizationImpact={95}
          personalizationFilters={
            persona
              ? [`categories.lvl0:${personaToFilterMap[persona]}`]
              : undefined
          }
          ruleContexts={[
            platform ? `platform-${platform}` : null,
            persona ? `persona-${personaToContextMap[persona]}` : null,
          ].filter(Boolean)}
        />
      </InstantSearch>
    </div>
  );
}
