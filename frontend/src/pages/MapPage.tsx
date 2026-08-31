import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MAP_PERIODS } from "../data/mapPeriods";

const STEPS_PER_PERIOD = 100;
const MAX_VALUE = MAP_PERIODS.length * STEPS_PER_PERIOD - 1;

function indexForValue(value: number): number {
  return Math.min(MAP_PERIODS.length - 1, Math.floor(value / STEPS_PER_PERIOD));
}

function formatYear(year: number): string {
  const rounded = Math.round(year);
  return rounded < 0 ? `б.з.б. ${Math.abs(rounded)} ж.` : `б.з. ${rounded} ж.`;
}

export default function MapPage() {
  const { slug } = useParams<{ slug: string }>();
  const [value, setValue] = useState(0);
  const index = indexForValue(value);
  const period = MAP_PERIODS[index];

  const bucketStart = index * STEPS_PER_PERIOD;
  const progress = (value - bucketStart) / STEPS_PER_PERIOD;
  const currentYear = period.startYear + progress * (period.endYear - period.startYear);

  return (
    <div className="page map-page">
      <Link to={`/${slug}`} className="back-link">
        ← К темам
      </Link>
      <h1>Карта по периодам</h1>

      <div className="map-year-counter">{formatYear(currentYear)}</div>
      <p className="map-period-states">
        {period.states.map((state, i) => (
          <span key={state.name}>
            {i > 0 && ", "}
            {state.topicId ? (
              <Link to={`/${slug}/topics/${state.topicId}`} className="map-state-link">
                {state.name}
              </Link>
            ) : (
              state.name
            )}
          </span>
        ))}
      </p>

      <div className="map-image-wrapper">
        <img src={period.image} alt={period.label} onError={(e) => (e.currentTarget.style.opacity = "0")} />
      </div>

      <input
        type="range"
        min={0}
        max={MAX_VALUE}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="map-slider"
      />
    </div>
  );
}
