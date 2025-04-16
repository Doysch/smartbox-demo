import React from 'react';
import { algoliasearch } from 'algoliasearch';import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  ClearRefinements,
  Configure,
} from 'react-instantsearch';

console.log(import.meta.env.VITE_ALGOLIA_APP_ID);

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;
console.log(import.meta.env.VITE_ALGOLIA_INDEX_NAME);

console.log(import.meta.env.VITE_ALGOLIA_APP_ID);

export default function App() {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}
    future={{
      preserveSharedStateOnUnmount: true,
    }}> 
      <div className="flex min-h-screen">
        <aside className="w-64 p-4 border-r border-gray-200 bg-white">
          <SearchBox placeholder="Filtrer par emplacement" classNames={{
            root: 'mb-4',
            input: 'w-full border px-3 py-2 rounded',
            submit: 'hidden',
            reset: 'ml-2 text-gray-500',
          }} />
          <ClearRefinements classNames={{
            button: 'mb-4 text-sm text-red-500 underline',
          }} />
          <h4 className="font-semibold mt-4">Prix</h4>
          <RefinementList attribute="price_range" />
          <h4 className="font-semibold mt-4">Nombre de personnes</h4>
          <RefinementList attribute="people_count" />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <Hits hitComponent={Hit} />
        </main>
      </div>
      <Configure hitsPerPage={12} />
    </InstantSearch>
  );
}

const Hit = ({ hit }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 w-full max-w-sm">
      <img
        src={hit["Listing Image"] || "https://via.placeholder.com/300x200"}
        alt={hit["Web Title"]}
        className="rounded-md mb-2 w-full h-48 object-cover"
      />
      <h3 className="text-lg font-semibold text-gray-800">{hit["Web Title"]}</h3>
      <p className="text-sm text-gray-600">{hit["Box Code"]}</p>
    </div>
  );
};