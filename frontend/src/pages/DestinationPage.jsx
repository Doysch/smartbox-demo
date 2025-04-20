import {
  InstantSearch,
  Configure,
  Pagination,
  Stats,
} from "react-instantsearch";
import { useParams } from "react-router-dom";
import { algoliasearch } from "algoliasearch";
import RefinementPanel from "../components/RefinementPanel";
import Hit from "../components/Hit";
import { useHits } from "react-instantsearch";
import smartboxLogo from "../images/smartbox-logo.png";
import ExperienceDropdown from "../components/ExperienceDropdown";
import OccasionsDropdown from "../components/OccasionsDropdown";
import DestinationsDropdown from "../components/DestinationsDropdown";
import CategoryDropdown from "../components/CategoryDropdown";
import SearchWrapper from "../components/SearchWrapper";
import "../App.css";

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

export default function DestinationPage() {
  const { destinationId } = useParams();
  const decodedDestination = decodeURIComponent(destinationId);

  return (
    <div className="app-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <header className="search-header">
          <div className="logo">
            <img
              src={smartboxLogo}
              alt="Smartbox Logo"
              onClick={() => (window.location.href = "/")}
            />
          </div>

          <div className="search-wrapper">
  <SearchWrapper />
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
            <div className="stats-wrapper">
              <Stats
                translations={{
                  rootElementText({ nbHits, processingTimeMS }) {
                    return `Résultats ${nbHits.toLocaleString(
                      "fr-FR"
                    )} trouvés en ${processingTimeMS}ms`;
                  },
                }}
              />
            </div>
            <CustomHits />
            <div className="pagination-container">
              <Pagination />
            </div>
          </div>
        </main>

        <Configure
          hitsPerPage={12}
          filters={`filters.pays:"${decodedDestination}"`}
        />
      </InstantSearch>
    </div>
  );
}
