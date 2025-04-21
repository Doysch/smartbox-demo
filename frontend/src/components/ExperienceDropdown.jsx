import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";
import "../App.css";

const experiences = [
  "Séjours",
  "Expériences européennes",
  "Loisirs et sorties",
  "Sport & aventure",
  "Gastronomie",
];

export default function ExperienceDropdown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();
  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Expériences ▾
      </button>

      {open && (
        <ul className="category-dropdown-menu">
          {experiences.map((cat) => (
            <li key={cat}>
              <Link
                to={`/experiences/${encodeURIComponent(cat)}`}
                className="category-link"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
