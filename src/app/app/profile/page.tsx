"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  RotateCcw,
  Store,
  LogOut,
  Trash2,
  ChevronRight,
  Volume2,
  Bell,
  Globe,
  Info,
} from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { Card, SettingsRow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToggleRow } from "@/components/ui/Toggle";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Dialog } from "@/components/ui/Dialog";
import { TextField } from "@/components/ui/TextField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useQueue } from "@/context/QueueContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateName, logout, deleteAccount } = useAuth();
  const { language, setLanguage, soundEnabled, setSoundEnabled, tipsEnabled, setTipsEnabled } = useSettings();
  const { showToast } = useQueue();

  const [isNameSheetOpen, setIsNameSheetOpen] = useState(false);
  const [isLangSheetOpen, setIsLangSheetOpen] = useState(false);
  const [isFeedbackSheetOpen, setIsFeedbackSheetOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);

  const [newName, setNewName] = useState(user?.name || "");
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const handleSaveName = () => {
    if (newName.trim()) {
      updateName(newName.trim());
      setIsNameSheetOpen(false);
      showToast("Naam badal gaya", "success");
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutDialogOpen(false);
    router.push("/login");
  };

  const handleDeleteAccountConfirm = () => {
    deleteAccount();
    setIsDeleteAccountDialogOpen(false);
    router.push("/login");
    showToast("Account aur data hata diya gaya", "info");
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Profile" isRootTab data-testid="profile.appbar" />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[20px]">
        {/* User Card */}
        <Card padding="20" data-testid="profile.card">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <h2 className="type-h2 text-[var(--c-text)] truncate">{user?.name || "Rahul Verma"}</h2>
              <span className="type-body-sm text-[var(--c-text-2)] truncate mt-[2px]">
                {user?.email || "rahul.verma@example.com"}
              </span>
            </div>
            <Button variant="tertiary" size="sm" onClick={() => setIsNameSheetOpen(true)}>
              Naam badlein
            </Button>
          </div>
        </Card>

        {/* MADAD Section */}
        <div className="flex flex-col gap-[8px]">
          <span className="type-overline text-[var(--c-text-2)] px-[4px]">MADAD</span>
          <Card padding="0">
            <SettingsRow
              icon={<CircleHelp className="w-[20px] h-[20px]" />}
              label="Guide (Madad)"
              onClick={() => router.push("/app/guide")}
            />
            <ToggleRow
              icon={<Info className="w-[20px] h-[20px]" />}
              label="Madad ke tips"
              checked={tipsEnabled}
              onChange={(val) => setTipsEnabled(val)}
            />
          </Card>
        </div>

        {/* SETTINGS Section */}
        <div className="flex flex-col gap-[8px]">
          <span className="type-overline text-[var(--c-text-2)] px-[4px]">SETTINGS</span>
          <Card padding="0">
            <SettingsRow
              icon={<Globe className="w-[20px] h-[20px]" />}
              label="Language"
              value={language === "hinglish" ? "Hinglish" : "English"}
              onClick={() => setIsLangSheetOpen(true)}
            />
            <SettingsRow
              icon={<Bell className="w-[20px] h-[20px]" />}
              label="Notification"
              value="Chalu"
              onClick={() => showToast("Notification permission active hai", "info")}
            />
            <SettingsRow
              icon={<Volume2 className="w-[20px] h-[20px]" />}
              label="Awaaz"
              value={soundEnabled ? "Chalu" : "Band"}
              onClick={() => showToast(`Awaaz ${soundEnabled ? "Chalu" : "Band"} hai`, "info")}
            />
            <SettingsRow
              icon={<RotateCcw className="w-[20px] h-[20px]" />}
              label="Recently Deleted"
              onClick={() => router.push("/app/profile/recently-deleted")}
            />
            <SettingsRow
              icon={<Store className="w-[20px] h-[20px]" />}
              label="Subscription"
              value="Trial: 1 din baaki"
              onClick={() => router.push("/app/profile/subscription")}
            />
          </Card>
        </div>

        {/* SUPPORT Section */}
        <div className="flex flex-col gap-[8px]">
          <span className="type-overline text-[var(--c-text-2)] px-[4px]">SUPPORT</span>
          <Card padding="0">
            <SettingsRow
              label="Madad chahiye?"
              onClick={() => showToast("WhatsApp Support link: +91 98765 43210", "info")}
            />
            <SettingsRow
              label="Feedback bhejein"
              onClick={() => setIsFeedbackSheetOpen(true)}
            />
            <SettingsRow
              label="Terms"
              onClick={() => router.push("/terms")}
            />
            <SettingsRow
              label="Privacy Policy"
              onClick={() => router.push("/privacy")}
            />
            <SettingsRow
              label="Refund/Cancellation"
              onClick={() => router.push("/refund")}
            />
          </Card>
        </div>

        {/* ACCOUNT Section */}
        <div className="flex flex-col gap-[8px]">
          <span className="type-overline text-[var(--c-text-2)] px-[4px]">ACCOUNT</span>
          <Card padding="0">
            <SettingsRow
              icon={<LogOut className="w-[20px] h-[20px] text-[var(--c-danger)]" />}
              label="Logout"
              showChevron={false}
              onClick={() => setIsLogoutDialogOpen(true)}
            />
            <SettingsRow
              icon={<Trash2 className="w-[20px] h-[20px] text-[var(--c-danger)]" />}
              label="Account delete karein"
              showChevron={false}
              onClick={() => setIsDeleteAccountDialogOpen(true)}
            />
            <SettingsRow
              icon={<Trash2 className="w-[20px] h-[20px] text-[var(--c-danger)]" />}
              label="Mera saara data hamesha ke liye hatao"
              showChevron={false}
              onClick={() => setIsDeleteAccountDialogOpen(true)}
            />
          </Card>
        </div>

        <p className="type-caption text-[var(--c-text-2)] text-center py-[16px]">
          Version 1.0.0
        </p>
      </div>

      {/* Name Edit Sheet */}
      <BottomSheet isOpen={isNameSheetOpen} onClose={() => setIsNameSheetOpen(false)} title="Naam badlein">
        <div className="flex flex-col gap-[16px]">
          <TextField label="Aapka naam" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
          <Button variant="primary" size="md" fullWidth onClick={handleSaveName}>
            Save karein
          </Button>
        </div>
      </BottomSheet>

      {/* Language Sheet */}
      <BottomSheet isOpen={isLangSheetOpen} onClose={() => setIsLangSheetOpen(false)} title="Language">
        <div className="flex flex-col gap-[16px]">
          <SegmentedControl
            options={[
              { id: "hinglish", label: "Hinglish" },
              { id: "english", label: "English" },
            ]}
            selectedId={language}
            onChange={(val) => {
              setLanguage(val as any);
              setIsLangSheetOpen(false);
            }}
          />
        </div>
      </BottomSheet>

      {/* Feedback Sheet */}
      <BottomSheet isOpen={isFeedbackSheetOpen} onClose={() => setIsFeedbackSheetOpen(false)} title="Feedback bhejein">
        <div className="flex flex-col gap-[16px]">
          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Aapko kya achha laga ya kya sudhaar chahiye?"
            className="w-full rounded-[12px] p-[16px] type-body bg-[var(--c-surface)] text-[var(--c-text)] border border-[var(--c-border-strong)] outline-none focus:border-[var(--c-accent)]"
          />
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              setIsFeedbackSheetOpen(false);
              showToast("Feedback bhej diya gaya. Dhanyavaad!", "success");
            }}
          >
            Bhejein
          </Button>
        </div>
      </BottomSheet>

      {/* Logout Dialog */}
      <Dialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        title="Logout karein?"
        body="Aap dobara Google se login kar sakte hain. Aapka data safe rahega."
        confirmLabel="Logout"
        cancelLabel="Nahi"
        isDestructive
        onConfirm={handleLogoutConfirm}
      />

      {/* Delete Account Dialog */}
      <Dialog
        isOpen={isDeleteAccountDialogOpen}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        title="Hamesha ke liye hatao?"
        body={
          <div className="flex flex-col gap-[12px]">
            <span>Ye turant aur hamesha ke liye hatega. Recovery nahi hogi.</span>
            <TextField
              label="Confirm karne ke liye apna naam likhein"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={user?.name || "Rahul Verma"}
            />
          </div>
        }
        confirmLabel="Hamesha ke liye hatao"
        cancelLabel="Nahi"
        isDestructive
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
}
