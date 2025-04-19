// src/components/BoxModal.jsx
import React, { useEffect, useState } from "react";
import { algoliasearch } from "algoliasearch";
import { X } from "lucide-react";

// 👉 initRecommend client
const recommendClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_RECOMMEND_API_KEY
).initRecommend();

export default function BoxModal({ box, onClose }) {
  if (!box) return null;

  const experiences = box.experiences || [];
  const [relatedHits, setRelatedHits] = useState([]);

  useEffect(() => {
    if (!box) return;

    recommendClient
      .getRecommendations({
        requests: [
          {
            indexName: "smartbox_boxes_CH-fr",
            objectID: box.objectID,
            model: "related-products",
            maxRecommendations: 4,
            threshold: 0,
          },
        ],
      })
      .then((res) => {
        console.log("📦 Related products for", box.objectID, res);
        setRelatedHits(res.results[0].hits || []);
      })
      .catch((err) => {
        console.error("❌ Recommend error in modal:", err);
        setRelatedHits([]);
      });
  }, [box]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content scrollable-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>

        {/* 📦 Box details */}
        <div className="box-details">
          <img
            src={box.listingImage || box.lengowImage}
            alt={box.webTitle}
            className="box-main-image small"
          />
          <h2>{box.webTitle}</h2>
          <p className="box-name">({box.boxUniverse})</p>
          <p>{box.price} €</p>
        </div>

        {/* ✨ Included experiences */}
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

        {/* 🔁 Recommend carousel section */}
        {relatedHits.length > 0 && (
  <div className="related-products-section">
    <h3>🔁 Recommandés pour vous (via Algolia Recommend)</h3>
    <div className="recommendation-carousel">
      {relatedHits.map((hit) => {
        console.log("🔍 hit in Recommend carousel:", hit); // 👉 You can now see what's in each hit

        const rating =
          !isNaN(parseFloat(hit.experienceRating))
            ? parseFloat(hit.experienceRating).toFixed(1)
            : !isNaN(parseFloat(hit.average_rating))
            ? parseFloat(hit.average_rating).toFixed(1)
            : null;

        return (
          <div className="recommendation-card" key={hit.objectID}>
            <img
              src={hit.listingImage || hit.lengowImage}
              alt={hit.webTitle}
              className="recommendation-image"
            />
            <p className="recommendation-title">
              {hit.webTitle || hit.boxName}
            </p>
            {rating && (
              <p className="recommendation-rating">⭐ {rating}/5</p>
            )}
            <p className="recommendation-price">{hit.price} €</p>
          </div>
        );
      })}
    </div>
  </div>
)}
      </div>
    </div>
  );
}
