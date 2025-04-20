// src/components/RefinementPanel.jsx
import React from "react";
import { RefinementList, CurrentRefinements } from "react-instantsearch";

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

      <div className="refinement-group">
        <h4>Prix</h4>
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
      </div>
      <div className="refinement-group">
        <h4>Catégories</h4>
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
      </div>

      <div className="refinement-group">
        <h4>Expériences</h4>
        <RefinementList
          attribute="filters.experiences"
          limit={5}
          showMore
          translations={showMoreTranslations}
        />
      </div>

      <div className="refinement-group">
        <h4>Occasions</h4>
        <RefinementList
          attribute="filters.occasions"
          limit={5}
          showMore
          translations={showMoreTranslations}
        />
      </div>

      <div className="refinement-group">
        <h4>Pour qui</h4>
        <RefinementList
          attribute="filters.pourQui"
          limit={5}
          showMore
          searchable
          searchablePlaceholder="Rechercher..."
          translations={showMoreTranslations}
        />
      </div>
    </aside>
  );
}
