import {
  InstantSearch,
  SearchBox,
  Configure,
  Pagination,
} from "react-instantsearch";
import { useParams } from "react-router-dom";
import { algoliasearch } from "algoliasearch";
import RefinementPanel from "../components/RefinementPanel";
import Hit from "../components/Hit";
import { useHits } from "react-instantsearch";
import smartboxLogo from "../images/smartbox-logo.png";
import { Link } from "react-router-dom";  
import CategoryDropdown from "../components/CategoryDropdown";
import OccasionsDropdown from "../components/OccasionsDropdown";
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

export default function OccasionPage() {
  const { occasionId } = useParams();
  const decodedCategory = decodeURIComponent(occasionId);

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
  <OccasionsDropdown />
</div>

        <main className="main-content">
          <div className="refinement-panel">
            <RefinementPanel />
          </div>
          <div className="content-area">
            <CustomHits />
            <div className="pagination-container">
              <Pagination />
            </div>
          </div>
        </main>
        <Configure
          hitsPerPage={12}
          filters={`filters.occasions:"${decodedCategory}"`}
        />{" "}
      </InstantSearch>
    </div>
  );
}
