"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { StepDots } from "@/components/ui/StepDots";
import { TextField } from "@/components/ui/TextField";
import { ToggleRow } from "@/components/ui/Toggle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StickyBar } from "@/components/ui/StickyBar";
import { useQueue } from "@/context/QueueContext";

export default function NewQueuePage() {
  const router = useRouter();
  const { createQueue } = useQueue();

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [counterName, setCounterName] = useState("");
  const [noLimit, setNoLimit] = useState(true);
  const [limitCount, setLimitCount] = useState("100");
  const [timeMode, setTimeMode] = useState<"auto" | "custom">("auto");
  const [customMinutes, setCustomMinutes] = useState("3");
  const [startNum, setStartNum] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    if (step === 1 && businessName.trim().length >= 2) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setIsLoading(true);
      setTimeout(() => {
        const q = createQueue({
          name: businessName.trim(),
          counterName: counterName.trim(),
          tokenLimit: noLimit ? undefined : parseInt(limitCount) || 100,
          avgTimeMode: timeMode,
          avgTimeMin: parseInt(customMinutes) || 3,
          startNumber: parseInt(startNum) || 1,
        });
        setIsLoading(false);
        router.push(`/app/business/${q.id}/qr`);
      }, 500);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between max-w-[var(--container-max)] mx-auto pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Nayi queue" onBack={() => (step > 1 ? setStep(step - 1) : router.back())} />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[20px]">
        <StepDots currentStep={step} totalSteps={3} />

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="flex flex-col gap-[16px] animate-in fade-in duration-fast">
            <h1 className="type-h1 text-[var(--c-text)]">Business ka naam</h1>

            <TextField
              label="Business ka naam"
              placeholder="jaise Sharma Sweets"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              autoFocus
            />

            <TextField
              label="Counter/queue ka naam (optional)"
              placeholder="jaise Counter 1"
              value={counterName}
              onChange={(e) => setCounterName(e.target.value)}
            />
          </div>
        )}

        {/* Step 2: Token Limit */}
        {step === 2 && (
          <div className="flex flex-col gap-[16px] animate-in fade-in duration-fast">
            <h1 className="type-h1 text-[var(--c-text)]">Kitne token tak?</h1>
            <p className="type-body-sm text-[var(--c-text-2)]">Limit poori hone par naya token nahi milega.</p>

            <Card padding="0">
              <ToggleRow
                label="Koi limit nahi"
                checked={noLimit}
                onChange={(val) => setNoLimit(val)}
              />
            </Card>

            {!noLimit && (
              <TextField
                label="Zyada se zyada token"
                inputMode="numeric"
                pattern="[0-9]*"
                value={limitCount}
                onChange={(e) => setLimitCount(e.target.value)}
              />
            )}
          </div>
        )}

        {/* Step 3: Time & Start Number */}
        {step === 3 && (
          <div className="flex flex-col gap-[16px] animate-in fade-in duration-fast">
            <h1 className="type-h1 text-[var(--c-text)]">Ek token me kitna time lagta hai?</h1>
            <p className="type-body-sm text-[var(--c-text-2)]">Ye sirf andaze ke liye hai. Number aap khud badlenge.</p>

            <div className="grid grid-cols-2 gap-[12px]">
              <Card
                padding="16"
                onClick={() => setTimeMode("auto")}
                className={`cursor-pointer transition-colors ${
                  timeMode === "auto"
                    ? "border-2 border-[var(--c-accent)] bg-[var(--c-accent-soft)]"
                    : ""
                }`}
              >
                <span className="type-body-strong text-[var(--c-text)]">Automatic</span>
                <p className="type-caption text-[var(--c-text-2)] mt-[4px]">
                  Pichhle logon ke time se andaza nikalega.
                </p>
              </Card>

              <Card
                padding="16"
                onClick={() => setTimeMode("custom")}
                className={`cursor-pointer transition-colors ${
                  timeMode === "custom"
                    ? "border-2 border-[var(--c-accent)] bg-[var(--c-accent-soft)]"
                    : ""
                }`}
              >
                <span className="type-body-strong text-[var(--c-text)]">Khud batao</span>
                <p className="type-caption text-[var(--c-text-2)] mt-[4px]">
                  Minutes fixed karein.
                </p>
              </Card>
            </div>

            {timeMode === "custom" && (
              <TextField
                label="Minutes per token"
                inputMode="numeric"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
              />
            )}

            <TextField
              label="Token kis number se shuru ho?"
              inputMode="numeric"
              value={startNum}
              onChange={(e) => setStartNum(e.target.value)}
            />
          </div>
        )}
      </div>

      <StickyBar>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={step === 1 && businessName.trim().length < 2}
          isLoading={isLoading}
          onClick={handleNextStep}
        >
          {step === 3 ? "Queue banayein" : "Aage badhein"}
        </Button>
      </StickyBar>
    </div>
  );
}
