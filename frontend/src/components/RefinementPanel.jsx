import React from "react";
import {
  RefinementList,
  CurrentRefinements,
  DynamicWidgets,
} from "react-instantsearch";
import Panel from "./Panel";

const showMoreTranslations = {
  showMoreButtonText({ isShowingMore }) {
    return isShowingMore ? "Voir moins" : "Découvrir plus";
  },
};

const refinementLabelMap = {
  "categories.lvl0": "Catégories",
  "filters.experiences": "Expériences",
  "filters.occasions": "Occasions",
  "filters.pourQui": "Pour qui",
};

const categoryTranslations = {
  Adventure: "Aventure",
  Stay: "Séjour",
  "Multi-thematic": "Multi-thématique",
  Gastronomy: "Gastronomie",
  "Stay Wellness": "Séjour Bien-être",
  OVP: "Offres variées",
  "Stay Gastronomy": "Séjour Gastronomique",
  Wellness: "Bien-être",
};

export default function RefinementPanel() {
  return (
    <aside className="refinement-panel">
      <CurrentRefinements
        transformItems={(items) =>
          items.map((item) => ({
            ...item,
            label: refinementLabelMap[item.attribute] || item.label,
          }))
        }
      />

      <DynamicWidgets fallbackComponent={null}>
        <Panel header="Prix">
          <RefinementList
            attribute="price_range"
            limit={5}
            transformItems={(items) =>
              items.map((item) => ({
                ...item,
                label: categoryTranslations[item.label] || item.label,
              }))
            }
          />
        </Panel>

        <Panel header="Catégories">
          <RefinementList
            attribute="categories.lvl0"
            limit={5}
            showMore
            translations={showMoreTranslations}
            transformItems={(items) =>
              items.map((item) => ({
                ...item,
                label: categoryTranslations[item.label] || item.label,
              }))
            }
          />
        </Panel>

        <Panel header="Expériences">
          <RefinementList
            attribute="filters.experiences"
            limit={5}
            showMore
            translations={showMoreTranslations}
          />
        </Panel>

        <Panel header="Occasions">
          <RefinementList
            attribute="filters.occasions"
            limit={5}
            showMore
            translations={showMoreTranslations}
          />
        </Panel>

        <Panel header="Pour qui">
          <RefinementList
            attribute="filters.pourQui"
            limit={5}
            showMore
            searchable
            searchablePlaceholder="Rechercher..."
            translations={showMoreTranslations}
          />
        </Panel>
        <Panel header="Dégustations">
          <RefinementList attribute="filters.degustations" />
        </Panel>

        <Panel header="Cantons suisses">
          <RefinementList attribute="filters.cantonsSuisses" />
        </Panel>
        <Panel header="category">
          <RefinementList attribute="categoryPageId" />
        </Panel>
      </DynamicWidgets>
    </aside>
  );
}
