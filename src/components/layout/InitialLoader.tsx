"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fffef8",
};

export function InitialLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div role="status" aria-label="Loading" style={overlayStyle}>
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#18532f"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90 126"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 24 24"
            to="360 24 24"
            dur="0.85s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
