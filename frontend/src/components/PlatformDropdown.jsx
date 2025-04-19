// src/components/PlatformDropdown.jsx
import React from "react";
import "../App.css";

export default function PlatformDropdown({ onChange }) {
  return (
    <div className="platform-dropdown-wrapper">
      
      <select
        id="platform-select"
        onChange={(e) => onChange(e.target.value)}
        className="platform-select"
      >
        <option value="">Toutes plateformes</option>
        <option value="desktop">Desktop</option>
        <option value="mobile">Mobile</option>
      </select>
    </div>
  );
}