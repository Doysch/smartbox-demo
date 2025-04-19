import React from "react";
import { useInstantSearch, useConnector } from "react-instantsearch";
import { connectSearchBox } from "instantsearch.js/es/connectors";
import Autocomplete from "./Autocomplete";

function VirtualSearchBox() {
  useConnector(connectSearchBox, {});
  return null;
}

export default function SearchWrapper({ onLogoClick }) {
  const { setUiState } = useInstantSearch();

  const handleSearchSubmit = (query) => {
    setUiState((uiState) => ({
      ...uiState,
      "smartbox_boxes_CH-fr": {
        ...uiState["smartbox_boxes_CH-fr"],
        query,
      },
    }));
  };

  const handleResetQuery = () => {
    setUiState((uiState) => ({
      ...uiState,
      "smartbox_boxes_CH-fr": {
        ...uiState["smartbox_boxes_CH-fr"],
        query: "",
      },
    }));
  };

  // Notify parent when logo is clicked
  React.useEffect(() => {
    if (onLogoClick) {
      onLogoClick(() => handleResetQuery());
    }
  }, [onLogoClick]);

  return (
    <>
      <VirtualSearchBox />
      <Autocomplete onSearchSubmit={handleSearchSubmit} />
    </>
  );
}