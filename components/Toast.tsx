"use client";
import React from "react";
export type ToastType = "info" | "success" | "error";
export interface ToastProps { message: string; type?: ToastType; actionLabel?: string; onAction?: () => void; onDismiss?: () => void; hasBottomNav?: boolean; durationMs?: number; hasActionBar?: boolean; testId?: string; }
// Floating bottom toasts were removed to keep controls unobstructed.
export const Toast: React.FC<ToastProps> = () => null;
