import React from "react";
import { useInstantSearch, useConnector } from "react-instantsearch";
import { connectSearchBox } from "instantsearch.js/es/connectors";
import Autocomplete from "./Autocomplete";

function VirtualSearchBox() {
  useConnector(connectSearchBox, {});
  return null;
}

export default function SearchWrapper() {
  const { uiState, setUiState } = useInstantSearch();

  const handleSearchSubmit = (query) => {
    if (!query) return;
    setUiState((prevUiState) => ({
      ...prevUiState,
      "smartbox_boxes_CH-fr": {
        ...prevUiState["smartbox_boxes_CH-fr"],
        query,
      },
    }));
  };

  // ✅ Define the current query value from the UI state
  const indexId = "smartbox_boxes_CH-fr";
  const currentQuery = uiState?.[indexId]?.query || "";

  return (
    <>
      <VirtualSearchBox />
      <Autocomplete onSearchSubmit={handleSearchSubmit} initialQuery={currentQuery} />
    </>
  );
}