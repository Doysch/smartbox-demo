import React from 'react';
import { useInstantSearch, useSearchBox } from 'react-instantsearch';

const popularSuggestions = ['Spa', 'Week-end', 'Aventure', 'Romantique'];
const popularCategories = ['Gastronomie', 'Séjour', 'Bien-être'];

export default function NoResultsFallback() {
  const { results } = useInstantSearch();
  const { refine } = useSearchBox();
  const query = results?.query;

  if (results.nbHits !== 0) return null;

  return (
    <div className="no-results-container">
      <h3>Aucun résultat pour “{query}”</h3>
      <p>Essayez une autre recherche ou explorez ces suggestions :</p>

      <div className="suggestions-row">
        {popularSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="suggestion-btn"
            onClick={() => refine(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <p>Ou choisissez une catégorie :</p>
      <div className="suggestions-row">
        {popularCategories.map((category) => (
          <button
            key={category}
            className="suggestion-btn"
            onClick={() => refine(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}