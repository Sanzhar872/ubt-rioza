import { useState } from "react";

// Trailing "viewed" indicator. The slot is always rendered so rows keep the same
// width (and text wrapping) whether or not a topic has been viewed.
// The check only animates when a topic *becomes* viewed while it's on screen —
// marks that are already there on first render just appear, so a long list
// doesn't flutter on every page load.
export default function ViewedMark({ viewed }: { viewed: boolean }) {
  const [viewedOnMount] = useState(viewed);
  const animate = viewed && !viewedOnMount;

  return (
    <span className="viewed-slot">
      {viewed && (
        <span
          className={`viewed-mark${animate ? " viewed-mark--animate" : ""}`}
          role="img"
          aria-label="Просмотрено"
          title="Просмотрено"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.6 10.4l3 3 5.8-6.2" />
          </svg>
        </span>
      )}
    </span>
  );
}
