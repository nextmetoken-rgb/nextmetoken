"use client";

import React from "react";
import { Zap, Image as ImageIcon } from "lucide-react";
import { IconButton } from "./IconButton";

export interface ViewfinderOverlayProps {
  onSuccess?: () => void;
  onTorchToggle?: () => void;
  onGallerySelect?: () => void;
  isSuccess?: boolean;
  testId?: string;
  label?: string;
}

export const ViewfinderOverlay: React.FC<ViewfinderOverlayProps> = ({
  onTorchToggle,
  onGallerySelect,
  isSuccess = false,
  testId = "viewfinder-overlay",
  label = "QR ko frame me lao",
}) => {
  const bracketColor = isSuccess ? "var(--c-scan-ok)" : "#FFFFFF";

  return (
    <div
      data-testid={testId}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,.45)",
        zIndex: "calc(var(--z-sticky) - 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Top Pill */}
      <div
        style={{
          position: "absolute",
          top: "calc(var(--safe-top) + 40px)",
          backgroundColor: "rgba(17,24,39,.6)",
          color: "#FFFFFF",
          padding: "8px 16px",
          borderRadius: "999px",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      {/* Viewfinder Square Box */}
      <div
        style={{
          position: "relative",
          width: "clamp(220px, 62vw, 260px)",
          height: "clamp(220px, 62vw, 260px)",
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
          borderRadius: "8px",
        }}
      >
        {/* Top-Left Bracket */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "32px",
            height: "32px",
            borderTop: `4px solid ${bracketColor}`,
            borderLeft: `4px solid ${bracketColor}`,
            borderTopLeftRadius: "8px",
            transition: "border-color 200ms ease",
          }}
        />
        {/* Top-Right Bracket */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "32px",
            height: "32px",
            borderTop: `4px solid ${bracketColor}`,
            borderRight: `4px solid ${bracketColor}`,
            borderTopRightRadius: "8px",
            transition: "border-color 200ms ease",
          }}
        />
        {/* Bottom-Left Bracket */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "32px",
            height: "32px",
            borderBottom: `4px solid ${bracketColor}`,
            borderLeft: `4px solid ${bracketColor}`,
            borderBottomLeftRadius: "8px",
            transition: "border-color 200ms ease",
          }}
        />
        {/* Bottom-Right Bracket */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "32px",
            height: "32px",
            borderBottom: `4px solid ${bracketColor}`,
            borderRight: `4px solid ${bracketColor}`,
            borderBottomRightRadius: "8px",
            transition: "border-color 200ms ease",
          }}
        />
      </div>

      {/* Bottom Controls Row */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(var(--safe-bottom) + 48px)",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <IconButton
          icon={<Zap size={24} />}
          aria-label="Torch toggle"
          variant="on-dark"
          onClick={onTorchToggle}
          testId={`${testId}.torch`}
        />
        <IconButton
          icon={<ImageIcon size={24} />}
          aria-label="Gallery select"
          variant="on-dark"
          onClick={onGallerySelect}
          testId={`${testId}.gallery`}
        />
      </div>
    </div>
  );
};
