import { useState } from "react";
import "../App.css";

export default function PersonaDropdown({ onChange }) {
    
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onChange(value); // Notify parent
  };

  return (
    <div className="persona-dropdown-wrapper">
      <label htmlFor="persona-select">Personas:&nbsp;</label>
      <select id="persona-select" value={selected} onChange={handleChange}>
        <option value="">Choisir un persona</option>
        <option value="Thrill Seeker">Aventurier</option>
        <option value="Foodie">Gourmand</option>
        <option value="Wellness Seeker">Bien-être</option>
        <option value="Family">Famille</option>
      </select>
    </div>
  );
}