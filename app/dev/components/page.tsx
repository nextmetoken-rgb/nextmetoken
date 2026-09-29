"use client";

import React from "react";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { AppBar } from "@/components/AppBar";
import { BottomNav, NavTab } from "@/components/BottomNav";
import { TextField } from "@/components/TextField";
import { Toggle, ToggleRow } from "@/components/Toggle";
import { Chip } from "@/components/Chip";
import { Card, ListRow, SettingsRow, PersonRow, QueueCard, TokenCard } from "@/components/Cards";
import { TicketCard } from "@/components/TicketCard";
import { NumberFlip } from "@/components/NumberFlip";
import { ProgressLine } from "@/components/ProgressLine";
import { BottomSheet } from "@/components/BottomSheet";
import { Dialog } from "@/components/Dialog";
import { Toast, ToastType } from "@/components/Toast";
import { Banner } from "@/components/Banner";
import { Skeleton } from "@/components/Skeleton";
import { Spinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { CoachMark } from "@/components/CoachMark";
import { StepDots } from "@/components/StepDots";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SwipeRow } from "@/components/SwipeRow";
import { QRFrame } from "@/components/QRFrame";
import { ViewfinderOverlay } from "@/components/ViewfinderOverlay";
import { GuideCard } from "@/components/GuideCard";
import { StickyBar } from "@/components/StickyBar";
import { Countdown } from "@/components/Countdown";
import { Store, ArrowLeft, Bell, Search, Info } from "lucide-react";

export default function ComponentsShowcasePage() {
  const [navTab, setNavTab] = React.useState<NavTab>("tokens");
  const [textValue, setTextValue] = React.useState("Gupta Sweets");
  const [textError, setTextError] = React.useState("");
  const [toggleVal, setToggleVal] = React.useState(true);
  const [flipNum, setFlipNum] = React.useState(12);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toastState, setToastState] = React.useState<{
    show: boolean;
    msg: string;
    type: ToastType;
    action?: string;
  }>({ show: false, msg: "", type: "info" });

  const [coachOpen, setCoachOpen] = React.useState(false);
  const [viewfinderOpen, setViewfinderOpen] = React.useState(false);
  const [guideOpen, setGuideOpen] = React.useState(false);
  const [segmentedVal, setSegmentedVal] = React.useState("today");

  const futureDate = React.useMemo(() => new Date(Date.now() + 86400000 * 2 + 10800000), []);

  return (
    <div style={{ paddingBottom: "120px" }}>
      <AppBar
        title="Component Showcase"
        rightActions={<IconButton icon={<Bell size={20} />} aria-label="Notifications" />}
      />

      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "24px" }}>

        {/* 2.1 Buttons */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "16px" }}>2.1 Buttons</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <Button variant="primary">Primary Md</Button>
            <Button variant="primary" size="lg">Primary Lg</Button>
            <Button variant="primary" size="sm">Primary Sm</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="danger-filled">Danger Filled</Button>
            <Button variant="danger-outline">Danger Outline</Button>
            <Button variant="danger-text">Danger Text</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <Button variant="primary" fullWidth>Full Width Button</Button>
        </section>

        {/* 2.2 IconButtons */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "16px" }}>2.2 IconButton</h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <IconButton icon={<ArrowLeft size={24} />} aria-label="Back" />
            <IconButton icon={<Search size={24} />} aria-label="Search" />
            <div style={{ backgroundColor: "#111827", padding: "8px", borderRadius: "12px" }}>
              <IconButton icon={<Bell size={24} />} aria-label="Dark mode icon" variant="on-dark" />
            </div>
          </div>
        </section>

        {/* 2.5 TextField */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.5 TextField</h2>
          <TextField
            label="Business ka naam"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onClear={() => setTextValue("")}
            helperText="Dukaan ya clinic ka sahi naam bharein"
          />
          <TextField
            label="Mobile Number"
            placeholder="10 digit number"
            error={textError}
            onChange={(e) => {
              const v = e.target.value;
              if (v && v.length < 10) setTextError("Sahi 10-digit number bharein");
              else setTextError("");
            }}
          />
          <TextField label="Disabled Input" value="Fixed value" disabled />
        </section>

        {/* 2.6 Toggle & ToggleRow */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.6 Toggle & ToggleRow</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Toggle checked={toggleVal} onChange={setToggleVal} />
            <span className="t-body">Toggle status: {toggleVal ? "ON" : "OFF"}</span>
          </div>
          <ToggleRow
            label="Awaaz alert (Sound)"
            helperText="Number aage badhne par ghanti bajegi"
            checked={toggleVal}
            onChange={setToggleVal}
          />
        </section>

        {/* 2.7 Chips */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "16px" }}>2.7 Chips / StatusBadges</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <Chip variant="live" />
            <Chip variant="paused" />
            <Chip variant="closed" />
            <Chip variant="waiting" />
            <Chip variant="next" />
            <Chip variant="now" />
            <Chip variant="done" />
            <Chip variant="left" />
            <Chip variant="walkin" />
            <Chip variant="trial" />
            <Chip variant="you" />
          </div>
        </section>

        {/* 2.8 Cards & Rows */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.8 Cards & Rows</h2>
          <PersonRow number={12} name="Ramesh Kumar" isNow />
          <PersonRow number={19} name="Aapka Token (User)" isYou />
          <PersonRow number={20} name="Sunita Devi" metaText="Intezar me: 15 min" chipVariant="waiting" />
          <PersonRow number={14} name="Vikram Singh" isRemoved />
          <SettingsRow label="Profile Settings" value="Edit" onClick={() => {}} />
          <QueueCard
            queueName="Main Counter (Mithai)"
            status="live"
            servingNumber={12}
            waitingCount={8}
            onClick={() => {}}
          />
          <TokenCard
            businessName="Sharma Sweets & Snacks"
            servingNumber={12}
            yourNumber={19}
            state="waiting"
            progressPercentage={40}
            onClick={() => {}}
          />
        </section>

        {/* 2.9 TicketCard */}
        <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.9 TicketCard ⭐</h2>
          <TicketCard servingNumber={flipNum} yourNumber={19} state="waiting" />
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Button size="sm" onClick={() => setFlipNum((n) => n + 1)}>
              Number Flip (+1)
            </Button>
          </div>
        </section>

        {/* 2.10 NumberFlip & 2.11 ProgressLine */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.10 NumberFlip & 2.11 ProgressLine</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="t-h3">Current:</span>
            <NumberFlip value={flipNum} className="t-display-l" />
          </div>
          <ProgressLine percentage={65} leftLabel="Abhi 12" rightLabel="Aap 19" />
          <ProgressLine percentage={40} compact />
        </section>

        {/* Interactive Modals Trigger */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 className="t-h2">2.12 Sheet, 2.13 Dialog, 2.14 Toast, 2.19 CoachMark</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <Button size="sm" onClick={() => setSheetOpen(true)}>Open BottomSheet</Button>
            <Button size="sm" variant="danger-outline" onClick={() => setDialogOpen(true)}>Open Delete Dialog</Button>
            <Button size="sm" variant="secondary" onClick={() => setToastState({ show: true, msg: "#14 hata diya", type: "info", action: "Undo" })}>
              Show Toast (Undo)
            </Button>
            <Button size="sm" variant="tertiary" onClick={() => setCoachOpen(!coachOpen)}>Toggle CoachMark</Button>
            <Button size="sm" variant="secondary" onClick={() => setViewfinderOpen(true)}>Camera Viewfinder</Button>
          </div>

          <CoachMark
            isOpen={coachOpen}
            message="Naya token lene ke liye yahan tap karein!"
            onDismiss={() => setCoachOpen(false)}
          />
        </section>

        {/* 2.15 Banners */}
        <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2 className="t-h2">2.15 Banners</h2>
          <Banner variant="offline" minutesAgo={3} />
          <Banner variant="paused" />
          <Banner variant="trial" timeLeft="2 din" />
          <Banner variant="locked" />
        </section>

        {/* 2.16 Skeleton & 2.17 Spinner */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.16 Skeleton & 2.17 Spinner</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Spinner size={32} />
            <Spinner size={20} color="var(--c-danger)" />
          </div>
          <Skeleton variant="card" height="80px" />
          <Skeleton variant="text" width="60%" />
        </section>

        {/* 2.18 EmptyState */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "16px" }}>2.18 EmptyState</h2>
          <EmptyState
            icon={<Store />}
            title="Koi active token nahi"
            body="QR scan karke kisi bhi dukaan ka token lein."
            actionLabel="Scan karein"
            onAction={() => setNavTab("scan")}
          />
        </section>

        {/* 2.20 StepDots & 2.21 SegmentedControl */}
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.20 StepDots & 2.21 SegmentedControl</h2>
          <StepDots totalSteps={3} currentStep={2} />
          <SegmentedControl
            options={[
              { value: "today", label: "Aaj" },
              { value: "history", label: "Purana" },
            ]}
            value={segmentedVal}
            onChange={setSegmentedVal}
          />
        </section>

        {/* 2.22 SwipeRow */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "16px" }}>2.22 SwipeRow (Owner Hatao)</h2>
          <SwipeRow
            personName="Sunita Devi"
            personNumber={14}
            onRemove={() => setToastState({ show: true, msg: "#14 hata diya", type: "info", action: "Undo" })}
          >
            <PersonRow number={14} name="Sunita Devi" metaText="Intezar me: 12 min" chipVariant="waiting" />
          </SwipeRow>
        </section>

        {/* 2.23 QRFrame */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "16px" }}>2.23 QRFrame</h2>
          <QRFrame businessName="Gupta General Store" value="https://tokenapp.in/q/demo" />
        </section>

        {/* 2.25 GuideCard */}
        <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="t-h2">2.25 GuideCard</h2>
          <GuideCard
            title="QR Code kaise print karein?"
            isOpen={guideOpen}
            onToggle={() => setGuideOpen(!guideOpen)}
            blocks={[
              {
                label: "Kaise karein",
                steps: [
                  { number: 1, text: "Business ka naam daalein" },
                  { number: 2, text: "QR download karke A4 sheet par print nikalwaein" },
                  { number: 3, text: "Dukaan ke gate par chipkaein" },
                ],
              },
            ]}
          />
        </section>

        {/* 2.27 Countdown */}
        <section className="card">
          <h2 className="t-h2" style={{ marginBottom: "8px" }}>2.27 Countdown</h2>
          <p className="t-body">
            Trial samay: <Countdown targetDate={futureDate} />
          </p>
        </section>
      </div>

      {/* Modals & Overlays */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Token details"
        subtitle="Sharma Sweets & Snacks"
        primaryAction={<Button variant="primary" fullWidth onClick={() => setSheetOpen(false)}>Samajh gaya</Button>}
      >
        <p className="t-body">Aapka number #19 hai. Kripya counter ke paas rahein.</p>
      </BottomSheet>

      <Dialog
        isOpen={dialogOpen}
        title="Pakka list se hatana hai?"
        body="#14 Sunita Devi ko line se hata diya jayega. 5 second me Undo kar sakte hain."
        primaryLabel="Haan, hatao"
        primaryVariant="danger-filled"
        onPrimary={() => {
          setDialogOpen(false);
          setToastState({ show: true, msg: "#14 hata diya", type: "info", action: "Undo" });
        }}
        cancelLabel="Nahi"
        onCancel={() => setDialogOpen(false)}
      />

      {toastState.show && (
        <Toast
          message={toastState.msg}
          type={toastState.type}
          actionLabel={toastState.action}
          onAction={() => setToastState({ ...toastState, show: false })}
          onDismiss={() => setToastState({ ...toastState, show: false })}
        />
      )}

      {viewfinderOpen && (
        <ViewfinderOverlay
          onTorchToggle={() => {}}
          onGallerySelect={() => setViewfinderOpen(false)}
        />
      )}

      <BottomNav activeTab={navTab} onTabChange={setNavTab} hasActiveToken />
    </div>
  );
}
