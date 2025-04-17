import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const categories = [
  "Séjours",
  "Expériences européennes",
  "Loisirs et sorties",
  "Sport & aventure",
  "Gastronomie",
];

export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="category-dropdown-wrapper">
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Parcourir les catégories ▾
      </button>

      {open && (
        <ul className="category-dropdown-menu">
          {categories.map((cat) => (
            <li key={cat}>
              <Link to={`/category/${encodeURIComponent(cat)}`} className="category-link">
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}