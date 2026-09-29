"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleHelp, ScanLine, Camera } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ViewfinderOverlay } from "@/components/ui/ViewfinderOverlay";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToggleRow } from "@/components/ui/Toggle";
import { SettingsRow } from "@/components/ui/Card";
import { useSettings } from "@/context/SettingsContext";
import { useQueue } from "@/context/QueueContext";

export default function ScanPage() {
  const router = useRouter();
  const { tipsEnabled, setTipsEnabled } = useSettings();
  const { showToast } = useQueue();

  const [cameraState, setCameraState] = useState<"scanning" | "prompt" | "denied" | "success">("scanning");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSimulatedScan = () => {
    setCameraState("success");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
    setTimeout(() => {
      router.push("/q/sharma123");
    }, 400);
  };

  const handleGallerySelect = () => {
    showToast("Gallery se QR upload ho gaya", "info");
    handleSimulatedScan();
  };

  return (
    <div className="relative min-h-dvh flex flex-col justify-between bg-black text-white max-w-[var(--container-max)] mx-auto overflow-hidden">
      {/* Transparent AppBar overlay */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-[16px] pt-[calc(12px+var(--safe-top))] pb-[12px]">
        <h2 className="type-h2 text-white pl-[8px]">Scan karein</h2>
        <IconButton
          variant="on-dark"
          aria-label="Madad"
          onClick={() => setIsHelpOpen(true)}
          data-testid="scan.help"
        >
          <CircleHelp className="w-[24px] h-[24px]" />
        </IconButton>
      </header>

      {/* Camera Viewport Container */}
      <div className="relative w-full flex-1 flex items-center justify-center bg-zinc-900">
        {cameraState === "scanning" && (
          <div
            onClick={handleSimulatedScan}
            aria-label="Tap to simulate scan"
            className="relative w-full h-full flex items-center justify-center cursor-pointer"
          >
            {/* Live Camera View Simulation background */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black opacity-90" />
            <ViewfinderOverlay
              isSuccess={false}
              onGallerySelect={handleGallerySelect}
              data-testid="scan.viewfinder"
            />
          </div>
        )}

        {cameraState === "prompt" && (
          <div className="p-[20px] w-full z-20">
            <Card padding="20" className="flex flex-col items-center text-center">
              <div className="w-[72px] h-[72px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] flex items-center justify-center mb-[16px]">
                <ScanLine className="w-[40px] h-[40px]" />
              </div>
              <h2 className="type-h2 text-[var(--c-text)]">Camera chalu karein</h2>
              <p className="type-body-sm text-[var(--c-text-2)] mt-[8px]">
                QR scan karne ke liye camera ki ijazat chahiye. Photo save nahi hoti.
              </p>
              <div className="flex flex-col gap-[8px] w-full mt-[24px]">
                <Button variant="primary" size="md" fullWidth onClick={() => setCameraState("scanning")}>
                  Camera chalu karein
                </Button>
                <Button variant="tertiary" size="md" fullWidth onClick={handleGallerySelect}>
                  Gallery se QR chuno
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Help Sheet */}
      <BottomSheet isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Madad">
        <div className="flex flex-col gap-[8px]">
          <ToggleRow
            label="Madad ke tips"
            helperText="Chhote popups dikhana chalu ya band karein."
            checked={tipsEnabled}
            onChange={(val) => setTipsEnabled(val)}
          />

          <SettingsRow
            icon={<CircleHelp className="w-[20px] h-[20px]" />}
            label="Guide (Madad)"
            onClick={() => {
              setIsHelpOpen(false);
              router.push("/app/guide");
            }}
          />
        </div>
      </BottomSheet>
    </div>
  );
}
