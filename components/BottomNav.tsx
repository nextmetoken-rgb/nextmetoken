"use client";

import React from "react";
import { Ticket, ScanLine, UserRound, Store } from "lucide-react";

export type NavTab = "tokens" | "scan" | "profile" | "business";

export interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  hasActiveToken?: boolean;
  testId?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasActiveToken = false,
  testId = "bottom-nav",
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "tokens", label: "Mere Tokens", icon: <Ticket size={24} /> },
    { id: "scan", label: "Scan", icon: <ScanLine size={28} /> },
    { id: "profile", label: "Profile", icon: <UserRound size={24} /> },
    { id: "business", label: "Business", icon: <Store size={24} /> },
  ];

  return (
    <nav
      data-testid={testId}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(var(--nav-h) + var(--safe-bottom))",
        backgroundColor: "var(--c-surface)",
        borderTop: "1px solid var(--c-border)",
        zIndex: "var(--z-nav)",
        paddingBottom: "var(--safe-bottom)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        maxWidth: "var(--container-max)",
        margin: "0 auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isScan = tab.id === "scan";

        if (isScan) {
          return (
            <button
              key={tab.id}
              data-testid={`nav.${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "transparent",
                position: "relative",
                cursor: "pointer",
                padding: 0,
                width: "25%",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "var(--c-accent)",
                  color: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  marginTop: "-20px",
                  boxShadow: "var(--shadow-3)",
                  transition: "transform 90ms ease",
                }}
              >
                {tab.icon}
              </div>
              <span
                className="t-caption"
                style={{
                  marginTop: "2px",
                  fontWeight: 600,
                  color: isActive ? "var(--c-accent)" : "var(--c-text-2)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            data-testid={`nav.${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              position: "relative",
              cursor: "pointer",
              padding: "4px 0",
              width: "25%",
              gap: "4px",
              color: isActive ? "var(--c-accent)" : "var(--c-text-2)",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "32px",
                borderRadius: "16px",
                backgroundColor: isActive ? "var(--c-accent-soft)" : "transparent",
                transition: "background-color 200ms ease",
              }}
            >
              {tab.icon}
              {tab.id === "tokens" && hasActiveToken && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "14px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "var(--c-next)",
                  }}
                />
              )}
            </div>
            <span
              className="t-caption"
              style={{
                fontWeight: 600,
                color: isActive ? "var(--c-accent)" : "var(--c-text-2)",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
