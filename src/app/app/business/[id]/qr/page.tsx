"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, Download } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { QRFrame } from "@/components/ui/QRFrame";
import { Button } from "@/components/ui/Button";
import { useQueue } from "@/context/QueueContext";

export default function QueueQRPage() {
  const params = useParams();
  const router = useRouter();
  const { queues, showToast } = useQueue();

  const id = (params?.id as string) || "q_sharma";
  const queue = queues.find((q) => q.id === id) || queues[0];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSaveImage = () => {
    showToast("QR Image download ho gayi", "success");
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(40px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="QR code" onBack={() => router.push(`/app/business/${id}`)} data-testid="qr.appbar" />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col items-center gap-[16px]">
        <div data-testid="qr.frame" className="w-full flex justify-center mt-[12px]">
          <QRFrame businessName={queue?.name || "Sharma Sweets"} />
        </div>

        <div className="w-full flex flex-col gap-[12px] mt-[16px]">
          <Button
            variant="primary"
            size="md"
            fullWidth
            icon={<Printer className="w-[20px] h-[20px]" />}
            onClick={handlePrint}
            data-testid="qr.print"
          >
            Print karein / PDF
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            icon={<Download className="w-[20px] h-[20px]" />}
            onClick={handleSaveImage}
            data-testid="qr.save"
          >
            Image save karein
          </Button>

          <p data-testid="qr.hint" className="type-caption text-[var(--c-text-2)] text-center mt-[4px]">
            Isko print karke counter par lagayein.
          </p>

          <Button
            variant="tertiary"
            size="md"
            fullWidth
            onClick={() => router.push(`/app/business/${id}`)}
            data-testid="qr.console"
          >
            Console kholein
          </Button>
        </div>
      </div>
    </div>
  );
}
