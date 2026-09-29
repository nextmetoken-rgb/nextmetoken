"use client";

import React from "react";

export interface QRFrameProps {
  businessName: string;
  qrCodeUrl?: string; // Data URL or Image src
  subText?: string;
  "data-testid"?: string;
}

export const QRFrame: React.FC<QRFrameProps> = ({
  businessName,
  qrCodeUrl,
  subText = "Scan karke token lein",
  "data-testid": testId,
}) => {
  // Simple fallback SVG QR representation if qrCodeUrl is not supplied directly
  const dummyQrDataUri =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#111827"><rect width="100" height="100" fill="#FFFFFF"/><rect x="10" y="10" width="30" height="30"/><rect x="15" y="15" width="20" height="20" fill="#FFFFFF"/><rect x="60" y="10" width="30" height="30"/><rect x="65" y="15" width="20" height="20" fill="#FFFFFF"/><rect x="10" y="60" width="30" height="30"/><rect x="15" y="65" width="20" height="20" fill="#FFFFFF"/><rect x="45" y="45" width="10" height="10"/><rect x="60" y="60" width="15" height="15"/><rect x="75" y="75" width="15" height="15"/><rect x="45" y="75" width="15" height="15"/></svg>`
    );

  return (
    <div
      data-testid={testId}
      className="w-full max-w-[340px] bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[20px] p-[20px] flex flex-col items-center text-center shadow-[var(--shadow-1)]"
    >
      <div className="w-[clamp(240px,70vw,280px)] h-[clamp(240px,70vw,280px)] bg-white border border-[var(--c-border)] rounded-[12px] p-[16px] flex items-center justify-center">
        {/* eslint-disable-next-html-element-suppression */}
        <img
          src={qrCodeUrl || dummyQrDataUri}
          alt={`QR Code for ${businessName}`}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="type-h3 text-[var(--c-text)] mt-[16px] truncate w-full">{businessName}</h3>
      <p className="type-body-sm text-[var(--c-text-2)] mt-[4px]">{subText}</p>
    </div>
  );
};
