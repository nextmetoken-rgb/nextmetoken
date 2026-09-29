"use client";

import React from "react";

export interface QRFrameProps {
  businessName: string;
  value?: string;
  testId?: string;
}

// Simple pure SVG QR Code generator for static/preview rendering without third party dependencies
export const SimpleQRCodeSVG: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 240,
}) => {
  // Deterministic 21x21 grid pattern generated from string hash to look like standard QR
  const modules = 21;
  const quietZone = 4;
  const totalModules = modules + quietZone * 2;
  const viewBox = `0 0 ${totalModules} ${totalModules}`;

  // Generate grid boolean array
  const grid: boolean[][] = Array.from({ length: modules }, () =>
    Array.from({ length: modules }, () => false)
  );

  // Position detection patterns (7x7 at 3 corners)
  const addFinderPattern = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 ||
          i === 6 ||
          j === 0 ||
          j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          grid[r + i][c + j] = true;
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, 14);
  addFinderPattern(14, 0);

  // Pseudo-random data modules based on value hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder pattern zones
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= 13) ||
        (r >= 13 && c < 8)
      ) {
        continue;
      }
      const val = Math.abs(Math.sin((r * 21 + c) * hash + hash)) > 0.45;
      grid[r][c] = val;
    }
  }

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      style={{ display: "block", background: "#FFFFFF" }}
      aria-label="QR Code"
    >
      {/* Quiet zone background */}
      <rect x={0} y={0} width={totalModules} height={totalModules} fill="#FFFFFF" />

      {/* Modules */}
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c + quietZone}
              y={r + quietZone}
              width={1}
              height={1}
              fill="#111827"
            />
          ) : null
        )
      )}
    </svg>
  );
};

export const QRFrame: React.FC<QRFrameProps> = ({
  businessName,
  value = "https://tokenapp.in/q/demo",
  testId = "qr-frame",
}) => {
  return (
    <div
      data-testid={testId}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid var(--c-border)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "320px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: "clamp(240px, 70vw, 280px)",
          height: "clamp(240px, 70vw, 280px)",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <SimpleQRCodeSVG value={value} size={240} />
      </div>

      <h3
        className="t-h3"
        style={{
          color: "var(--c-text)",
          textAlign: "center",
          marginTop: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {businessName}
      </h3>
      <p className="t-body-sm" style={{ color: "var(--c-text-2)", textAlign: "center", marginTop: "4px" }}>
        Scan karke token lein
      </p>
    </div>
  );
};
