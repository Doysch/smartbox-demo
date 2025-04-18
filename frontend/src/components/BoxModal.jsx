// src/components/BoxModal.jsx
import React from "react";
import { X } from "lucide-react";

export default function BoxModal({ box, onClose }) {
  if (!box) return null;

  const experiences = box.experiences || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content scrollable-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>

        <div className="box-details">
          <img
            src={box.listingImage || box.lengowImage}
            alt={box.webTitle}
            className="box-main-image small"
          />
          <h2>{box.webTitle}</h2>
          <p className="box-name">({box.boxName})</p>
          <p>{box.price} €</p>
        </div>

        <div className="box-experiences">
          <h3 className="modal-subtitle">Expériences incluses</h3>
          {experiences.length > 0 ? (
            <div className="experience-cards-grid">
              {experiences.slice(0, 3).map((exp, idx) => (
                <div className="experience-card" key={idx}>
                  <img
                    src={exp.imageUrl}
                    alt="Expérience visuelle"
                    className="experience-image"
                  />
                  <div className="experience-content">
                    <p className="experience-title">
                      {exp.experienceComponents
                        ? JSON.parse(exp.experienceComponents)[0]
                        : "Détail non disponible"}
                    </p>
                    <p className="experience-rating">
                      ⭐{" "}
                      {!isNaN(parseFloat(exp.experienceRating))
                        ? `${parseFloat(exp.experienceRating).toFixed(1)}`
                        : "N/A"}
                    </p>
                    <p className="experience-info">
                      {exp.experiencePracticalInfo?.length > 150
                        ? exp.experiencePracticalInfo.slice(0, 150) + "..."
                        : exp.experiencePracticalInfo || "Non spécifié"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune expérience trouvée.</p>
          )}
        </div>

        <div className="box-recommendations">
          <h3 className="modal-subtitle">Recommandations similaires</h3>
          {/* Replace this with <Recommend hit={box} /> or your own component */}
          <div style={{ padding: "1rem", fontStyle: "italic", color: "#666" }}>
            [Place for recommendations...]
          </div>
        </div>
      </div>
    </div>
  );
}
