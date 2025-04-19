// src/components/Autocomplete.jsx
import React, { useEffect, useRef } from "react";
import { algoliasearch } from "algoliasearch";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import "../App.css";
const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: "smartbox-recent",
  limit: 3,
});

export default function Autocomplete({ onSearchSubmit }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = autocomplete({
      container: "#autocomplete",
      plugins: [],
      placeholder: "Recherchez une expérience...",
      openOnFocus: true,
      classNames: {
        panel: "aa-Panel two-column-panel",
      },
      onSubmit({ state }) {
        const query = state.query?.trim();
        if (query) {
          recentSearchesPlugin.data.addItem({ label: query });
          onSearchSubmit(query);
        }
      },
      getSources({ query }) {
        return [
          {
            sourceId: "recentSearches",
            classNames: {
              section: "aa-Section--left",
            },
            getItems() {
              return recentSearchesPlugin.data.getAll();
            },
            templates: {
              header() {
                return "Recherches récentes";
              },
              item({ item, html }) {
                return html`<div>${item.label}</div>`;
              },
            },
          },
          {
            sourceId: "querySuggestions",
            classNames: {
              section: "aa-Section--left",
            },
            getItems({ query }) {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: "smartbox_boxes_CH-fr_query_suggestions",
                    query: query || "", // fallback to empty string if no input
                    params: {
                      hitsPerPage: 5,
                    },
                  },
                ],
              });
            },
            templates: {
              header() {
                return "Suggestions";
              },
              item({ item }) {
                return item.query;
              },
            },
            section: "left",
          },
          {
            sourceId: "boxes",
            classNames: {
              section: "aa-Section--right",
            },
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: "smartbox_boxes_CH-fr",
                    query,
                    params: {
                      hitsPerPage: 5,
                      attributesToHighlight: ["webTitle"],
                    },
                  },
                ],
              });
            },
            templates: {
              header() {
                return "Coffrets Smartbox";
              },
              item({ item, html, components }) {
                return html`
                  <div class="autocomplete-box-item">
                    <img
                      src="${item.listingImage}"
                      alt="${item.webTitle}"
                      class="box-thumbnail"
                    />
                    <div class="box-title">
                      ${components.Highlight({
                        hit: item,
                        attribute: "webTitle",
                      })}
                    </div>
                  </div>
                `;
              },
            },
          },
        ];
      },
    });

    return () => instance.destroy();
  }, [onSearchSubmit]);

  return (
    <div
      id="autocomplete"
      ref={containerRef}
      className="autocomplete-wrapper"
    />
  );
}
