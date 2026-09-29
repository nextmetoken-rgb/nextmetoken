"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Volume2,
  QrCode,
  Pause,
  Play,
  Moon,
  Clock,
  Settings,
  Trash2,
  CircleHelp,
} from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { IconButton } from "@/components/ui/IconButton";
import { TicketCard } from "@/components/ui/TicketCard";
import { Card, PersonRow, SettingsRow } from "@/components/ui/Card";
import { ToggleRow } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { StickyBar } from "@/components/ui/StickyBar";
import { SwipeRow } from "@/components/ui/SwipeRow";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Dialog } from "@/components/ui/Dialog";
import { TextField } from "@/components/ui/TextField";
import { Chip } from "@/components/ui/Chip";
import { Banner } from "@/components/ui/Banner";
import { useQueue } from "@/context/QueueContext";
import { useSettings } from "@/context/SettingsContext";

export default function QueueConsolePage() {
  const params = useParams();
  const router = useRouter();
  const {
    queues,
    tokens,
    nextNumber,
    prevNumber,
    addWalkin,
    removeUser,
    pauseQueue,
    resumeQueue,
    endDay,
    deleteQueue,
    showToast,
  } = useQueue();
  const { soundEnabled, setSoundEnabled } = useSettings();

  const id = (params?.id as string) || "q_sharma";
  const queue = queues.find((q) => q.id === id) || queues[0];

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isWalkinOpen, setIsWalkinOpen] = useState(false);
  const [isEndDayOpen, setIsEndDayOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [walkinName, setWalkinName] = useState("");
  const [walkinError, setWalkinError] = useState("");

  if (!queue) {
    return (
      <div className="p-[20px] text-center my-auto">
        <p className="type-h3 text-[var(--c-text)]">Queue nahi mili</p>
        <Button variant="primary" size="md" className="mt-[16px]" onClick={() => router.push("/app/business")}>
          Business tab par jayein
        </Button>
      </div>
    );
  }

  const currentNum = queue.currentNumber;
  const waitingTokens = tokens.filter((t) => t.queueId === queue.id && t.status === "waiting");

  const handleNext = () => {
    nextNumber(queue.id);
  };

  const handlePrev = () => {
    prevNumber(queue.id);
  };

  const handleAddWalkinSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!walkinName.trim()) {
      setWalkinError("Naam likhein.");
      return;
    }
    setWalkinError("");
    addWalkin(queue.id, walkinName.trim());
    setWalkinName("");
    setIsWalkinOpen(false);
  };

  const handleEndDayConfirm = () => {
    endDay(queue.id);
    setIsEndDayOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteQueue(queue.id);
    setIsDeleteDialogOpen(false);
    router.push("/app/business");
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[1000px] mx-auto pb-[calc(110px+var(--safe-bottom))] bg-[var(--c-bg)]">
      {/* AppBar */}
      <AppBar
        title={queue.name}
        onBack={() => router.push("/app/business")}
        data-testid="con.appbar"
        rightActions={
          <div className="flex items-center gap-[4px]">
            <Chip variant={queue.status === "live" ? "live" : "paused"} />
            <IconButton
              aria-label="Console options"
              onClick={() => setIsMoreOpen(true)}
              data-testid="con.more"
            >
              <EllipsisVertical className="w-[24px] h-[24px]" />
            </IconButton>
          </div>
        }
      />

      {queue.status === "paused" && <Banner variant="paused" data-testid="con.banner" />}

      {/* Main Console Content */}
      <div className="px-[var(--page-pad)] pt-[12px] lg:grid lg:grid-cols-2 lg:gap-[24px]">
        {/* Left Column Controls */}
        <div className="flex flex-col gap-[16px]">
          {/* Ticket Hero Console Variant */}
          <div data-testid="con.hero">
            <TicketCard
              state={queue.status === "closed" ? "closed" : "waiting"}
              variant="console"
              currentNumber={currentNum}
              startTimeText={`Shuru: 9:00 AM · Aaj ${currentNum + waitingTokens.length} token`}
            />
          </div>

          {/* Sound Announcement Toggle */}
          <Card padding="0" data-testid="con.sound">
            <ToggleRow
              icon={<Volume2 className="w-[24px] h-[24px]" />}
              label="Awaaz announcement"
              checked={soundEnabled}
              onChange={(val) => setSoundEnabled(val)}
            />
            <p className="type-caption text-[var(--c-text-2)] px-[16px] pb-[12px]">
              Awaaz tabhi aayegi jab ye screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi.
            </p>
          </Card>

          {/* Walk-in Add Button */}
          <Button
            variant="secondary"
            size="md"
            fullWidth
            icon={<UserPlus className="w-[20px] h-[20px]" />}
            onClick={() => setIsWalkinOpen(true)}
            data-testid="con.walkin"
          >
            Walk-in add karein
          </Button>

          {/* Stats Text */}
          <p data-testid="con.stats" className="type-caption text-[var(--c-text-2)] text-center">
            Aaj: {currentNum + waitingTokens.length} token · Ausat wait {queue.avgTimeMin} min
          </p>
        </div>

        {/* Right Column Waiting List */}
        <div className="flex flex-col gap-[8px] mt-[24px] lg:mt-0">
          <h3 data-testid="con.list-head" className="type-h3 text-[var(--c-text)]">
            Intezar me ({waitingTokens.length})
          </h3>

          <div data-testid="con.list" className="flex flex-col gap-[8px]">
            {waitingTokens.length === 0 ? (
              <Card padding="20" className="text-center">
                <p className="type-body-sm text-[var(--c-text-2)]">Abhi koi intezar me nahi hai. Customer QR scan karke judenge.</p>
              </Card>
            ) : (
              waitingTokens.map((t) => (
                <SwipeRow key={t.id} onRemove={() => removeUser(queue.id, t.id)}>
                  <PersonRow
                    number={t.number}
                    name={t.userName}
                    subText={t.isWalkin ? "Walk-in" : "Kitne der se: 12 min"}
                    chipVariant={t.isWalkin ? "walkin" : undefined}
                  />
                </SwipeRow>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Controls Thumb Zone (con.bar) */}
      <StickyBar data-testid="con.bar">
        <div className="w-full flex items-center gap-[12px]">
          <Button
            variant="secondary"
            size="lg"
            onClick={handlePrev}
            data-testid="con.prev"
            className="w-[104px] shrink-0"
          >
            <ChevronLeft className="w-[24px] h-[24px]" />
            <span>Pichla</span>
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            data-testid="con.next"
            className="flex-1"
          >
            <span className="flex-1 text-center">Agla</span>
            <ChevronRight className="w-[24px] h-[24px]" />
          </Button>
        </div>
      </StickyBar>

      {/* Console Options Sheet */}
      <BottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} title="Options">
        <div className="flex flex-col py-[4px]">
          <SettingsRow
            icon={<QrCode className="w-[20px] h-[20px]" />}
            label="QR dikhao / print"
            onClick={() => {
              setIsMoreOpen(false);
              router.push(`/app/business/${queue.id}/qr`);
            }}
          />
          {queue.status === "paused" ? (
            <SettingsRow
              icon={<Play className="w-[20px] h-[20px]" />}
              label="Line chalu karein"
              onClick={() => {
                setIsMoreOpen(false);
                resumeQueue(queue.id);
              }}
            />
          ) : (
            <SettingsRow
              icon={<Pause className="w-[20px] h-[20px]" />}
              label="Line rok dein"
              onClick={() => {
                setIsMoreOpen(false);
                pauseQueue(queue.id);
              }}
            />
          )}
          <SettingsRow
            icon={<Moon className="w-[20px] h-[20px]" />}
            label="Din khatam (End day)"
            onClick={() => {
              setIsMoreOpen(false);
              setIsEndDayOpen(true);
            }}
          />
          <SettingsRow
            icon={<Clock className="w-[20px] h-[20px]" />}
            label="History"
            onClick={() => {
              setIsMoreOpen(false);
              router.push(`/app/business/${queue.id}/history`);
            }}
          />
          <SettingsRow
            icon={<Settings className="w-[20px] h-[20px]" />}
            label="Settings"
            onClick={() => {
              setIsMoreOpen(false);
              router.push(`/app/business/${queue.id}/settings`);
            }}
          />
          <SettingsRow
            icon={<CircleHelp className="w-[20px] h-[20px]" />}
            label="Guide (Madad)"
            onClick={() => {
              setIsMoreOpen(false);
              router.push("/app/guide");
            }}
          />
          <SettingsRow
            icon={<Trash2 className="w-[20px] h-[20px] text-[var(--c-danger)]" />}
            label="Delete karein"
            showChevron={false}
            onClick={() => {
              setIsMoreOpen(false);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>
      </BottomSheet>

      {/* Walk-in Add Sheet (O6) */}
      <BottomSheet isOpen={isWalkinOpen} onClose={() => setIsWalkinOpen(false)} title="Walk-in add karein" subtitle="Jinke paas phone nahi hai unka naam likhein.">
        <form onSubmit={handleAddWalkinSubmit} className="flex flex-col gap-[16px]">
          <TextField
            label="Naam"
            placeholder="Customer ka naam"
            value={walkinName}
            onChange={(e) => {
              setWalkinName(e.target.value);
              if (walkinError) setWalkinError("");
            }}
            errorText={walkinError}
            autoFocus
            autoCapitalize="words"
          />
          <div className="flex flex-col gap-[8px] mt-[8px]">
            <Button variant="primary" size="md" fullWidth onClick={() => handleAddWalkinSubmit()}>
              Number dein
            </Button>
            <Button variant="tertiary" size="md" fullWidth onClick={() => setIsWalkinOpen(false)}>
              Wapas
            </Button>
          </div>
        </form>
      </BottomSheet>

      {/* End Day Dialog (O7) */}
      <Dialog
        isOpen={isEndDayOpen}
        onClose={() => setIsEndDayOpen(false)}
        title="Aaj ka kaam khatam karein?"
        body="Bache hue token khatam ho jayenge. Customer scan karenge toh 'Ye line band hai' dikhega."
        confirmLabel="Din khatam karein"
        cancelLabel="Nahi"
        onConfirm={handleEndDayConfirm}
      />

      {/* Delete Queue Dialog (O8) */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Ye queue delete karein?"
        body="3 din tak Settings > Recently Deleted se wapas la sakte hain. Uske baad ye hamesha ke liye hat jayegi."
        confirmLabel="Delete karein"
        cancelLabel="Nahi"
        isDestructive
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
