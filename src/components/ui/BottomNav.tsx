"use client";

import React, { useEffect, useState } from "react";
import Link from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { Ticket, ScanLine, Store, UserRound } from "lucide-react";

export interface BottomNavProps {
  hasActiveLiveToken?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ hasActiveLiveToken = false }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.visualViewport) {
        // If visual viewport height is significantly less than window innerHeight, keyboard is open
        const isOpen = window.visualViewport.height < window.innerHeight - 150;
        setIsKeyboardOpen(isOpen);
      }
    };
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    }
  }, []);

  if (isKeyboardOpen) return null;

  const tabs = [
    {
      id: "tokens",
      label: "Mere Tokens",
      href: "/app/tokens",
      icon: Ticket,
      badge: hasActiveLiveToken,
    },
    {
      id: "scan",
      label: "Scan",
      href: "/app/scan",
      icon: ScanLine,
      isRaised: true,
    },
    {
      id: "business",
      label: "Business",
      href: "/app/business",
      icon: Store,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/app/profile",
      icon: UserRound,
    },
  ];

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] bg-[var(--c-surface)] border-t border-[var(--c-border)]"
      style={{
        paddingBottom: "var(--safe-bottom)",
        height: "calc(var(--nav-h) + var(--safe-bottom))",
      }}
    >
      <div className="max-w-[var(--container-max)] mx-auto h-[var(--nav-h)] grid grid-cols-4 items-center px-[8px]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          if (tab.isRaised) {
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                data-testid={`nav.${tab.id}`}
                className="relative flex flex-col items-center justify-center h-full group"
              >
                <div
                  className="w-[56px] h-[56px] rounded-full bg-[var(--c-accent)] text-white shadow-[var(--shadow-3)] flex items-center justify-center -mt-[20px] active:scale-[0.96] transition-transform duration-fast"
                >
                  <ScanLine className="w-[28px] h-[28px]" />
                </div>
                <span
                  className={`type-caption font-semibold mt-[2px] ${
                    isActive ? "text-[var(--c-accent)]" : "text-[var(--c-text-2)]"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              data-testid={`nav.${tab.id}`}
              className="relative flex flex-col items-center justify-center h-full group select-none outline-none"
            >
              <div className="relative flex items-center justify-center w-[56px] h-[32px] rounded-[16px]">
                {isActive && (
                  <span className="absolute inset-0 bg-[var(--c-accent-soft)] rounded-[16px] animate-in fade-in zoom-in-95 duration-fast" />
                )}
                <Icon
                  className={`w-[24px] h-[24px] relative z-10 ${
                    isActive ? "text-[var(--c-accent)]" : "text-[var(--c-text-2)]"
                  }`}
                />
                {tab.badge && (
                  <span className="absolute top-[4px] right-[14px] z-20 w-[8px] h-[8px] rounded-full bg-[var(--c-next)]" />
                )}
              </div>
              <span
                className={`type-caption font-semibold mt-[2px] ${
                  isActive ? "text-[var(--c-accent)] font-semibold" : "text-[var(--c-text-2)]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
