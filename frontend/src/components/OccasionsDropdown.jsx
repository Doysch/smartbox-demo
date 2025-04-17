import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';

const occasions = [
  "Anniversaire",
  "Mariage",
  "Départ",
  "Retraite"
  // ...add others from your data
];

export default function OccasionsDropdown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();
useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Parcourir les occasions ▾
      </button>

      {open && (
        <ul className="category-dropdown-menu">
          {occasions.map((occasion) => (
            <li key={occasion}>
              <Link to={`/occasions/${encodeURIComponent(occasion)}`} className="category-link">
                {occasion}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}