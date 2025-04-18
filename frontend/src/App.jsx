import React, { useState } from "react";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  Configure,
  Pagination,
} from "react-instantsearch";
import "./App.css";
import smartboxLogo from "./images/smartbox-logo.png";
import { useHits } from "react-instantsearch";
import Hit from "./components/Hit";
import BoxModal from "./components/BoxModal";
import RefinementPanel from "./components/RefinementPanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExperiencePage from "./pages/ExperiencePage";
import ExperienceDropdown from "./components/ExperienceDropdown";
import OccasionsDropdown from "./components/OccasionsDropdown";
import { Link } from "react-router-dom";
import DestinationsDropdown from "./components/DestinationsDropdown";
import CategoryDropdown from "./components/CategoryDropdown";
import PersonaDropdown from "./components/PersonaDropdown";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

function CustomHits() {
  const { hits } = useHits();
  const [selectedBox, setSelectedBox] = useState(null);

  const handleBoxClick = (box) => {
    setSelectedBox(box);
  };

  const closeModal = () => setSelectedBox(null);

  return (
    <>
    <div className="hits-container">
      {hits.map((hit) => (
        <Hit key={hit.objectID} hit={hit} onBoxClick={handleBoxClick} />
      ))}
    </div>
    
    <BoxModal box={selectedBox} onClose={closeModal} />
    </>

  );
}

export default function App() {
  const [persona, setPersona] = useState("");

  const handlePersonaChange = (selectedPersona) => {
    setPersona(selectedPersona);
  };

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
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <header className="search-header">
          <Link to="/" className="logo">
            <img src={smartboxLogo} alt="Smartbox Logo" />
          </Link>

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

          <PersonaDropdown onChange={handlePersonaChange} />
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

        <div className="dropdowns-row">
          <CategoryDropdown />
          <ExperienceDropdown />
          <OccasionsDropdown />
          <DestinationsDropdown />
        </div>
        <main className="main-content">
          <div className="refinement-panel">
            <RefinementPanel />
          </div>

          <div className="content-area">
            <div className="hits-container">
              <CustomHits />
            </div>
            <div className="pagination-container">
              <Pagination />
            </div>
          </div>
        </main>

        <Configure
          hitsPerPage={12}
          personalizationFilters={
            persona
              ? [`categories.lvl0:${personaToFilterMap[persona]}`]
              : undefined
          }
          enablePersonalization={true}
          personalizationImpact={95}
        />
      </InstantSearch>
    </div>
  );
}
