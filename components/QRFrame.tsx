"use client";

import React from "react";
import { QRCodeSVG } from "./QRCodeSVG";

export interface QRFrameProps {
  businessName: string;
  value?: string;
  testId?: string;
}

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
        <QRCodeSVG value={value} size="100%" label={`QR code: ${businessName}`} />
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
