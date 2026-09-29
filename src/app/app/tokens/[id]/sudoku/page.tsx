"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { Button } from "@/components/ui/Button";
import { useQueue } from "@/context/QueueContext";

export default function SudokuPage() {
  const params = useParams();
  const router = useRouter();
  const { tokens, queues } = useQueue();

  const tokenId = (params?.id as string) || "t_19";
  const token = tokens.find((t) => t.id === tokenId) || tokens[0];
  const queue = queues.find((q) => q.id === token?.queueId);

  const currentNum = queue ? queue.currentNumber : 12;
  const yourNum = token ? token.number : 19;
  const peopleAhead = Math.max(0, yourNum - currentNum - 1);

  // Initial 9x9 grid sample board
  const [grid, setGrid] = useState<number[][]>([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? num : cell))
    );
    setGrid(newGrid);
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto bg-[var(--c-bg)] pb-[calc(24px+var(--safe-bottom))]">
      <AppBar title="Time pass ke liye Sudoku" onBack={() => router.back()} />

      {/* Sticky status strip (hamesha upar) */}
      <div
        data-testid="sudoku.strip"
        className="sticky top-[var(--appbar-h)] z-10 w-full h-[56px] bg-[var(--c-accent-soft)] border-b border-[var(--c-accent-soft-border)] px-[20px] flex items-center justify-between type-body-strong text-[var(--c-accent)]"
      >
        <span>Chal raha: <strong className="tabular-nums">{currentNum}</strong></span>
        <span>Aapka: <strong className="tabular-nums">{yourNum}</strong></span>
        <span><strong className="tabular-nums">{peopleAhead}</strong> pehle</span>
      </div>

      <div className="px-[var(--page-pad)] pt-[16px] flex flex-col items-center gap-[20px]">
        {/* 9x9 Board */}
        <div
          data-testid="sudoku.grid"
          className="w-full max-w-[360px] aspect-square bg-[var(--c-surface)] border-2 border-[var(--c-text)] grid grid-cols-9 grid-rows-9"
        >
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
              const borderRight = (c + 1) % 3 === 0 && c < 8 ? "border-r-2 border-r-[var(--c-text)]" : "border-r border-r-[var(--c-border-strong)]";
              const borderBottom = (r + 1) % 3 === 0 && r < 8 ? "border-b-2 border-b-[var(--c-text)]" : "border-b border-b-[var(--c-border-strong)]";

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleCellClick(r, c)}
                  className={`flex items-center justify-center type-h3 font-bold select-none outline-none ${borderRight} ${borderBottom} ${
                    isSelected
                      ? "bg-[var(--c-accent-soft)] text-[var(--c-accent)]"
                      : val !== 0
                      ? "text-[var(--c-text)]"
                      : "text-[var(--c-accent)]"
                  }`}
                >
                  {val !== 0 ? val : ""}
                </button>
              );
            })
          )}
        </div>

        {/* Tools row */}
        <div data-testid="sudoku.tools" className="flex items-center gap-[12px]">
          <Button variant="tertiary" size="sm" onClick={() => setSelectedCell(null)}>
            Mitao
          </Button>
          <Button variant="tertiary" size="sm" onClick={() => handleNumberInput(1)}>
            Hint (3)
          </Button>
        </div>

        {/* Number Pad */}
        <div data-testid="sudoku.pad" className="w-full max-w-[360px] flex flex-col gap-[8px]">
          <div className="grid grid-cols-5 gap-[8px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleNumberInput(n)}
                className="h-[48px] rounded-[12px] bg-[var(--c-surface)] border border-[var(--c-border-strong)] type-h3 font-bold text-[var(--c-text)] active:bg-[var(--c-surface-2)]"
              >
                {n}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-[8px]">
            {[6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleNumberInput(n)}
                className="h-[48px] rounded-[12px] bg-[var(--c-surface)] border border-[var(--c-border-strong)] type-h3 font-bold text-[var(--c-text)] active:bg-[var(--c-surface-2)]"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
