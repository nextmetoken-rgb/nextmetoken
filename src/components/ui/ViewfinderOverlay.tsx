"use client";

import React, { useState } from "react";
import { Flashlight, Image as ImageIcon } from "lucide-react";
import { IconButton } from "./IconButton";

export interface ViewfinderOverlayProps {
  isSuccess?: boolean;
  onTorchToggle?: (enabled: boolean) => void;
  onGallerySelect?: () => void;
  "data-testid"?: string;
}

export const ViewfinderOverlay: React.FC<ViewfinderOverlayProps> = ({
  isSuccess = false,
  onTorchToggle,
  onGallerySelect,
  "data-testid": testId,
}) => {
  const [torchOn, setTorchOn] = useState(false);

  const handleTorch = () => {
    const nextState = !torchOn;
    setTorchOn(nextState);
    onTorchToggle?.(nextState);
  };

  const bracketColor = isSuccess ? "border-[#86EFAC]" : "border-white";

  return (
    <div
      data-testid={testId}
      className="absolute inset-0 z-10 flex flex-col items-center justify-between p-[20px] pointer-events-none select-none overflow-hidden"
    >
      {/* Top hint pill */}
      <div className="mt-[calc(var(--appbar-h)+var(--safe-top)+16px)] pointer-events-auto">
        <div className="px-[16px] py-[8px] rounded-full bg-[rgba(17,24,39,0.6)] text-white type-body-strong">
          QR ko frame me lao
        </div>
      </div>

      {/* Center Viewfinder cutout box */}
      <div className="relative w-[clamp(220px,62vw,260px)] h-[clamp(220px,62vw,260px)] shrink-0 my-auto">
        {/* Top-Left Bracket */}
        <div
          className={`absolute top-0 left-0 w-[32px] h-[32px] border-t-4 border-l-4 rounded-tl-[8px] transition-colors duration-fast ${bracketColor}`}
        />
        {/* Top-Right Bracket */}
        <div
          className={`absolute top-0 right-0 w-[32px] h-[32px] border-t-4 border-r-4 rounded-tr-[8px] transition-colors duration-fast ${bracketColor}`}
        />
        {/* Bottom-Left Bracket */}
        <div
          className={`absolute bottom-0 left-0 w-[32px] h-[32px] border-b-4 border-l-4 rounded-bl-[8px] transition-colors duration-fast ${bracketColor}`}
        />
        {/* Bottom-Right Bracket */}
        <div
          className={`absolute bottom-0 right-0 w-[32px] h-[32px] border-b-4 border-r-4 rounded-br-[8px] transition-colors duration-fast ${bracketColor}`}
        />
      </div>

      {/* Bottom Controls */}
      <div className="mb-[calc(var(--nav-h)+var(--safe-bottom)+20px)] flex items-center gap-[24px] pointer-events-auto">
        <IconButton
          variant="on-dark"
          aria-label="Torch toggle"
          onClick={handleTorch}
          className={torchOn ? "!bg-white !text-[var(--c-text)]" : ""}
          data-testid="scan.torch"
        >
          <Flashlight className="w-[24px] h-[24px]" />
        </IconButton>

        <IconButton
          variant="on-dark"
          aria-label="Gallery se QR chuno"
          onClick={onGallerySelect}
          data-testid="scan.gallery"
        >
          <ImageIcon className="w-[24px] h-[24px]" />
        </IconButton>
      </div>
    </div>
  );
};
