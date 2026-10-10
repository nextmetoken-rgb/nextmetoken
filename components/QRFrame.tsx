"use client";

import React from "react";
import { QRCodeSVG } from "./QRCodeSVG";
import { brand } from "@/lib/brand";

export interface QRFrameProps {
  businessName: string;
  value?: string;
  bookId?: string;
  testId?: string;
}

export const QRFrame: React.FC<QRFrameProps> = ({
  businessName,
  value = "https://nextmetoken.vercel.app/q/demo",
  bookId,
  testId = "qr-frame",
}) => (
  <div className="qrf" data-testid={testId}>
    <h3 className="qrf-name">{businessName}</h3>
    <div className="qrf-card">
      <span className="qrf-corner tl" /><span className="qrf-corner tr" /><span className="qrf-corner bl" /><span className="qrf-corner br" />
      <div className="qrf-qr"><QRCodeSVG value={value} size="100%" label={`QR code: ${businessName}`} /></div>
    </div>
    <p className="qrf-scan">Scan karke token lein</p>
    <ol className="qrf-steps">
      <li><b>1</b><span>Phone camera se QR scan karein</span></li>
      <li><b>2</b><span>Google se login karke naam likhein</span></li>
      <li><b>3</b><span>Token lein aur live number dekhein</span></li>
    </ol>
    {bookId && <div className="qrf-book"><small>QR na chale to Book ID likhein</small><strong>{bookId}</strong></div>}
    <p className="qrf-brand">{brand.name}</p>
  </div>
);
