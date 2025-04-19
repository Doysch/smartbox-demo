import React from "react";
import { useInstantSearch, useConnector } from "react-instantsearch";
import { connectSearchBox } from "instantsearch.js/es/connectors";
import Autocomplete from "./Autocomplete";

// This creates a virtual search box via hook, compatible with React InstantSearch v7
function VirtualSearchBox() {
  useConnector(connectSearchBox, {});
  return null;
}

export default function SearchWrapper() {
  const { setUiState } = useInstantSearch();

  const handleSearchSubmit = (query) => {
    if (!query) return;
    setUiState((uiState) => ({
      ...uiState,
      "smartbox_boxes_CH-fr": {
        ...uiState["smartbox_boxes_CH-fr"],
        query,
      },
    }));
  };

  return (
    <>
      <VirtualSearchBox />
      <Autocomplete onSearchSubmit={handleSearchSubmit} />
    </>
  );
}