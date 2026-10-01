"use client";

import React from "react";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: "text" | "card" | "circle" | "custom";
  testId?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  variant = "text",
  testId,
  style,
}) => {
  const getRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    switch (variant) {
      case "text":
        return "6px";
      case "card":
        return "16px";
      case "circle":
        return "999px";
      case "custom":
      default:
        return "8px";
    }
  };

  const getDefaultHeight = () => {
    if (height !== undefined) return height;
    switch (variant) {
      case "text":
        return "20px";
      case "card":
        return "120px";
      case "circle":
        return "40px";
      default:
        return "20px";
    }
  };

  const getDefaultWidth = () => {
    if (width !== undefined) return width;
    switch (variant) {
      case "text":
        return "100%";
      case "card":
        return "100%";
      case "circle":
        return "40px";
      default:
        return "100%";
    }
  };

  return (
    <div
      data-testid={testId}
      className="animate-shimmer"
      style={{
        width: getDefaultWidth(),
        height: getDefaultHeight(),
        borderRadius: getRadius(),
        backgroundColor: "var(--c-skeleton)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
};
