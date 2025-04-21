import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";
import "../App.css";

const destinations = ["Suisse", "Italie", "France", "Europe", "Allemagne"];

export default function DestinationsDropdown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();
  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Destinations ▾
      </button>

      {open && (
        <ul className="category-dropdown-menu">
          {destinations.map((dest) => (
            <li key={dest}>
              <Link
                to={`/destinations/${encodeURIComponent(dest)}`}
                className="category-link"
              >
                {dest}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
