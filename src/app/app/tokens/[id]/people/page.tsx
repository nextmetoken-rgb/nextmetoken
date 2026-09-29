"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { PersonRow } from "@/components/ui/Card";
import { useQueue } from "@/context/QueueContext";

export default function PeoplePage() {
  const params = useParams();
  const router = useRouter();
  const { tokens, queues } = useQueue();

  const tokenId = (params?.id as string) || "t_19";
  const currentToken = tokens.find((t) => t.id === tokenId);
  const queue = queues.find((q) => q.id === currentToken?.queueId);

  const currentNum = queue ? queue.currentNumber : 12;

  const peopleList = [
    { number: 12, name: "Vikram Malhotra", sub: "Walk-in", isServing: true },
    { number: 13, name: "Amit Kumar", sub: "Kitne der se: 12 min" },
    { number: 14, name: "Priya Sharma", sub: "Walk-in" },
    { number: 15, name: "Suresh Gupta", sub: "Kitne der se: 8 min" },
    { number: 19, name: currentToken?.userName || "Rahul Verma", sub: "Kitne der se: 5 min", isYou: true },
    { number: 20, name: "Deepak Verma", sub: "Kitne der se: 2 min" },
  ];

  const leftList = [
    { number: 10, name: "Anita Roy", sub: "Line chhod di", isWithdrawn: true },
    { number: 11, name: "Karan Johar", sub: "Line chhod di", isWithdrawn: true },
  ];

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Line ke log" onBack={() => router.back()} data-testid="people.appbar" />

      <div className="px-[var(--page-pad)] py-[8px]">
        <span data-testid="people.count" className="type-caption text-[var(--c-text-2)]">
          {peopleList.length} log line me
        </span>
      </div>

      <div data-testid="people.list" className="flex flex-col gap-[8px] px-[var(--page-pad)]">
        {/* Serving Section */}
        <span className="type-overline text-[var(--c-text-2)] mt-[8px]">AB CHAL RAHA HAI</span>
        {peopleList
          .filter((p) => p.isServing)
          .map((p) => (
            <PersonRow
              key={p.number}
              number={p.number}
              name={p.name}
              subText={p.sub}
              isServing
            />
          ))}

        {/* Waiting Section */}
        <span className="type-overline text-[var(--c-text-2)] mt-[16px]">INTEZAR ME</span>
        {peopleList
          .filter((p) => !p.isServing)
          .map((p) => (
            <PersonRow
              key={p.number}
              number={p.number}
              name={p.name}
              subText={p.sub}
              isYou={p.isYou}
            />
          ))}

        {/* Left Section */}
        <span className="type-overline text-[var(--c-text-2)] mt-[16px]">HAAL HI ME CHHODNE WALE</span>
        {leftList.map((p) => (
          <PersonRow
            key={p.number}
            number={p.number}
            name={p.name}
            subText={p.sub}
            isWithdrawn
            chipVariant="left"
          />
        ))}
      </div>
    </div>
  );
}
