"use client";

import React, { useEffect, useState } from "react";
import { CircleCheck, TriangleAlert, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "undo";

export interface ToastState {
  id: string;
  message: string;
  type?: ToastType;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
  hasNav?: boolean;
  "data-testid"?: string;
}

export const Toast: React.FC<ToastProps> = ({
  toast,
  onDismiss,
  hasNav = true,
  "data-testid": testId,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const dur = toast.duration || (toast.type === "undo" ? 5000 : toast.type === "error" ? 6000 : 4000);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 150);
      }, dur);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [toast, onDismiss]);

  if (!toast || !isVisible) return null;

  const bottomOffset = hasNav
    ? "bottom-[calc(var(--nav-h)+var(--safe-bottom)+12px)]"
    : "bottom-[calc(var(--safe-bottom)+12px)]";

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      data-testid={testId || "toast"}
      className={`fixed left-[20px] right-[20px] z-[var(--z-toast)] max-w-[440px] mx-auto min-h-[48px] px-[16px] py-[12px] rounded-[12px] bg-[var(--c-toast-bg)] text-white shadow-[var(--shadow-3)] flex items-center justify-between gap-[12px] animate-in slide-in-from-bottom-4 fade-in duration-base ease-decel ${bottomOffset}`}
    >
      <div className="flex items-center gap-[10px] min-w-0 flex-1">
        {toast.type === "success" && <CircleCheck className="w-[20px] h-[20px] text-[#86EFAC] shrink-0" />}
        {toast.type === "error" && <TriangleAlert className="w-[20px] h-[20px] text-[#FCA5A5] shrink-0" />}
        {(toast.type === "info" || toast.type === "undo" || !toast.type) && (
          <Info className="w-[20px] h-[20px] text-white shrink-0" />
        )}
        <span className="type-body-sm text-white line-clamp-2">{toast.message}</span>
      </div>

      {(toast.actionLabel || toast.onAction) && (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            onDismiss();
          }}
          className="type-label text-[#FCD34D] min-h-[48px] px-[8px] flex items-center justify-center shrink-0 hover:underline"
        >
          {toast.actionLabel || "Undo"}
        </button>
      )}
    </div>
  );
};
