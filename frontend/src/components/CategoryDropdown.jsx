import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import useClickOutside from "../hooks/useClickOutside";

const categories = [
  { value: "Stay", label: "Séjour" },
  { value: "Adventure", label: "Aventure" },
  { value: "Multi-thematic", label: "Multi-thématique" },
  { value: "Gastronomy", label: "Gastronomie" },
  { value: "Stay Wellness", label: "Bien-être" },
];

export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Catégories ▾
      </button>

      {open && (
        <ul className="category-dropdown-menu">
          {categories.map(({ value, label }) => (
            <li key={value}>
              <Link
                to={`/categories/${encodeURIComponent(value)}`}
                className="category-link"
                onClick={() => setOpen(false)} // make it close
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
