import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import '../App.css';

const occasions = [
  "Anniversaire",
  "Mariage",
  "Départ",
  "Retraite",
  "Félicitations"
];

export default function OccasionsDropdown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();
useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="category-dropdown-wrapper" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Occasions ▾
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