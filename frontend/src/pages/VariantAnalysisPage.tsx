import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { VARIANT_VIDEOS } from "../data/variantAnalysis";

export default function VariantAnalysisPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selected, setSelected] = useState(VARIANT_VIDEOS[0]);

  const sources = Array.from(new Set(VARIANT_VIDEOS.map((v) => v.source)));

  return (
    <div className="page">
      <Link to={`/${slug}`} className="back-link">
        ← К темам
      </Link>
      <h1>Нұсқа талдау</h1>

      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${selected.youtubeId}`}
          title={`${selected.number}-нұсқа`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {sources.map((source) => (
        <div key={source} className="variant-group">
          <p className="era-header">{source}</p>
          <div className="variant-list">
            {VARIANT_VIDEOS.filter((v) => v.source === source).map((v) => (
              <button
                key={v.youtubeId}
                className={`variant-button ${v.youtubeId === selected.youtubeId ? "active" : ""}`}
                onClick={() => setSelected(v)}
              >
                {v.number}-нұсқа
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
