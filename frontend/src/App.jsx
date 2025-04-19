// App.jsx
import React, { useState, useEffect } from "react";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  Configure,
  Pagination,
  Stats,
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
import { connectSearchBox } from 'instantsearch.js/es/connectors';
const VirtualSearchBoxWidget = connectSearchBox(() => null);

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

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

  const personaToFilterMap = {
    "Thrill Seeker": "Adventure",
    Foodie: "Gastronomy",
    "Wellness Seeker": "Stay Wellness",
    Stay: "Stay",
  };

  return (
    <div className="app-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        routing={{ router: history(), stateMapping: singleIndex(indexName) }}
      >


        <header className="search-header">
          
          <Link to="/" className="logo">
            <img src={smartboxLogo} alt="Smartbox Logo" />
          </Link>
          <SearchWrapper />
          <PersonaDropdown onChange={setPersona} />
          <div className="nav-icons">
            <div className="nav-item"><span className="icon">👤</span><span>Me connecter</span></div>
            <div className="nav-item"><span className="icon">🛒</span><span>Panier</span></div>
          </div>
          <PlatformDropdown onChange={setPlatform} />
        </header>

        <div className="dropdowns-row">
          <CategoryDropdown />
          <ExperienceDropdown />
          <OccasionsDropdown />
          <DestinationsDropdown />
        </div>

        <main className="main-content">
          {isMobile ? (
            <div className="refinement-toggle-wrapper">
              <button onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </button>
              {showFilters && <RefinementPanel />}
            </div>
          ) : <RefinementPanel />}

          <div className="content-area">
            <Stats translations={{ rootElementText({ nbHits, processingTimeMS }) {
              return `Résultats ${nbHits.toLocaleString("fr-FR")}, trouvés en ${processingTimeMS}ms`;
            }}} />
            <CustomHits />
            <Pagination />
          </div>
        </main>

        <Configure
          hitsPerPage={12}
          enablePersonalization
          personalizationImpact={95}
          personalizationFilters={persona ? [`categories.lvl0:${personaToFilterMap[persona]}`] : undefined}
          ruleContexts={platform ? [`platform-${platform}`] : []}
        />
      </InstantSearch>
    </div>
  );
}
