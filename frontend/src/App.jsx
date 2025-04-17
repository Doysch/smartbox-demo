import React from "react";
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
import RefinementPanel from "./components/RefinementPanel";

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

const showMoreTranslations = {
  showMoreButtonText({ isShowingMore }) {
    return isShowingMore ? "Voir moins" : "Découvrir plus";
  },
};

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

        <Configure hitsPerPage={12} />
      </InstantSearch>
    </div>
  );
}
