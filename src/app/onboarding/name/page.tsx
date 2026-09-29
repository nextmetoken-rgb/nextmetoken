"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { StickyBar } from "@/components/ui/StickyBar";
import { useAuth } from "@/context/AuthContext";

function NameOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateName } = useAuth();
  const [name, setName] = useState(user?.name || "Rahul Verma");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nextUrl = searchParams.get("next") || "/app/scan";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Naam kam se kam 2 akshar ka likhein.");
      return;
    }
    if (/^\d+$/.test(trimmed)) {
      setError("Naam me sirf number nahi ho sakte.");
      return;
    }

    setError("");
    setIsLoading(true);
    updateName(trimmed);
    setTimeout(() => {
      setIsLoading(false);
      router.push(nextUrl);
    }, 400);
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between max-w-[var(--container-max)] mx-auto px-[var(--page-pad)] pt-[calc(48px+var(--safe-top))] pb-[calc(88px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 data-testid="name.title" className="type-h1 text-[var(--c-text)]">
          Aapka poora naam
        </h1>

        <p data-testid="name.sub" className="type-body-sm text-[var(--c-text-2)] mt-[8px]">
          Ye naam is line ke sabhi log dekhenge.
        </p>

        <div className="mt-[24px]">
          <TextField
            label="Poora naam"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            errorText={error}
            autoFocus
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="done"
            data-testid="name.field"
          />
        </div>
      </form>

      <StickyBar>
        <Button
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          onClick={() => handleSubmit()}
          data-testid="name.cta"
        >
          Aage badhein
        </Button>
      </StickyBar>
    </div>
  );
}

export default function NameOnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--c-bg)]" />}>
      <NameOnboardingContent />
    </Suspense>
  );
}
