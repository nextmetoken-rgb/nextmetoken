"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronRight } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { GuideCard } from "@/components/ui/GuideCard";

export default function GuidePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"customer" | "owner">("customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [showIphoneDetails, setShowIphoneDetails] = useState(false);

  const customerCards = [
    {
      title: "QR scan karna",
      whatIsIt: "Dukaan ke QR se line me judne ka tarika.",
      howToSteps: [
        "Scan tab kholein ya phone ka camera use karein",
        "QR ko frame me rakhein",
        '"Token lein" dabayein',
      ],
      keepInMind: "QR sirf dukaan/counter pe scan karna hai. Kisi ka bheja hua QR nahi chalta.",
    },
    {
      title: "Token lena",
      whatIsIt: "Line me aapka number.",
      howToSteps: ["QR scan karein", "Naam check karein", '"Token lein"'],
      keepInMind: "Ek queue me ek hi active token milta hai.",
    },
    {
      title: "Live screen kaise padhein",
      whatIsIt: "Aapki line ka live haal.",
      howToSteps: ["Upar bada number = abhi chal raha number.", 'Neeche "Aapka token" = aapka number.'],
      keepInMind: "Number apne aap badalta hai, refresh nahi karna.",
    },
    {
      title: '"Andaza" ka matlab',
      whatIsIt: "Aapke number ke aane ka anumaan.",
      howToSteps: ["Ye pichhle logon ke time se nikala jata hai."],
      keepInMind: "Ye 100% sahi nahi hota, thoda upar-neeche ho sakta hai.",
    },
    {
      title: "Awaaz on/off",
      whatIsIt: "Number bolke batane wali awaaz.",
      howToSteps: ['Live screen par "Awaaz se batao" chalu karein.'],
      keepInMind: "Awaaz tabhi aati hai jab screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi, tab sirf notification milega.",
    },
    {
      title: "Notification",
      whatIsIt: "Baari aane par phone par alert.",
      howToSteps: ['Token lene ke baad "Notification chalu karein" dabayein.'],
      keepInMind: "iPhone me pehle Home Screen par add karna padta hai (neeche iPhone card dekhein).",
    },
    {
      title: "Line chhodna",
      whatIsIt: "Token wapas dena.",
      howToSteps: ['Live screen par "Line chhodein" > "Haan, chhodein"'],
      keepInMind: "Chhodne ke baad number wapas nahi milta.",
    },
  ];

  const ownerCards = [
    {
      title: "Queue banana",
      whatIsIt: "Aapki dukaan ki line.",
      howToSteps: ['Business tab > Nayi queue banayein > naam, limit, time > "Queue banayein"'],
      keepInMind: "2 din free trial ke baad subscription chahiye.",
    },
    {
      title: "Token limit",
      whatIsIt: "Kitne token tak dena hai.",
      howToSteps: ['Step 2 me "Koi limit nahi" band karke number likhein.'],
      keepInMind: "Limit poori hone par naye customer ko token nahi milega.",
    },
    {
      title: "QR print karna",
      whatIsIt: "Counter par lagane wala QR.",
      howToSteps: ['QR screen > "Print karein / PDF"'],
      keepInMind: "QR sirf counter par lagayein. Share ka option nahi hai.",
    },
    {
      title: "Agla / Pichla / Undo",
      whatIsIt: "Number aage-peeche karna.",
      howToSteps: ['Console me "Agla" dabayein. Galti ho toh 5 second me "Undo".'],
      keepInMind: '"Pichla" sirf galti sudharne ke liye hai.',
    },
    {
      title: "Walk-in add karna",
      whatIsIt: "Jinke paas phone nahi.",
      howToSteps: ['Console > "Walk-in add karein" > naam likhein > "Number dein"'],
      keepInMind: "Zyada log saath aaye toh sabke liye yahi karein.",
    },
    {
      title: "Kisi ko hatana",
      whatIsIt: "Spam ya no-show hatana.",
      howToSteps: ["List me row ko left swipe karein (ya ⋮ > Hatao)."],
      keepInMind: "Hatate hi agla number turant aage aata hai. Undo 5 second me.",
    },
  ];

  const cardsToDisplay: Array<{
    title: string;
    whatIsIt?: string;
    whenToUse?: string;
    howToSteps?: string[];
    keepInMind?: string;
  }> = activeTab === "customer" ? customerCards : ownerCards;
  const filteredCards = cardsToDisplay.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatIsIt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(40px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Guide (Madad)" onBack={() => router.back()} data-testid="guide.appbar" />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[16px]">
        {/* Pinned iPhone Card */}
        <Card
          padding="16"
          data-testid="guide.iphone-card"
          onClick={() => setShowIphoneDetails((prev) => !prev)}
          className="bg-[var(--c-accent-soft)] border-[var(--c-accent-soft-border)] cursor-pointer"
        >
          <div className="flex items-center justify-between gap-[12px]">
            <div className="flex items-center gap-[10px]">
              <Bell className="w-[20px] h-[20px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-strong text-[var(--c-accent)]">
                iPhone me notification kaise chalu karein
              </span>
            </div>
            <ChevronRight
              className={`w-[20px] h-[20px] text-[var(--c-accent)] transition-transform duration-base ${
                showIphoneDetails ? "rotate-90" : ""
              }`}
            />
          </div>

          {showIphoneDetails && (
            <div className="mt-[12px] pt-[12px] border-t border-[var(--c-accent-soft-border)] flex flex-col gap-[8px] type-body-sm text-[var(--c-text)]">
              <p>iPhone me notification tabhi aate hain jab website Home Screen par add ho. iOS 16.4 ya naya chahiye.</p>
              <ol className="list-decimal list-inside flex flex-col gap-[6px] mt-[4px]">
                <li><strong>Safari</strong> me website kholein.</li>
                <li>Neeche <strong>Share (⬆︎)</strong> dabayein.</li>
                <li><strong>Add to Home Screen</strong> chunein, phir <strong>Add</strong> dabayein.</li>
                <li>Ab <strong>Home Screen ke icon se</strong> kholein (Safari se nahi). Yahan ek baar phir Google se login karna padega.</li>
                <li>Profile &gt; Settings &gt; <strong>Notification chalu karein</strong> dabayein, aur <strong>Allow</strong> chunein.</li>
              </ol>
            </div>
          )}
        </Card>

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kuch dhundhein…"
            data-testid="guide.search"
            className="w-full h-[48px] rounded-[12px] pl-[44px] pr-[16px] type-body bg-[var(--c-surface)] border border-[var(--c-border-strong)] outline-none focus:border-[var(--c-accent)]"
          />
          <Search className="absolute left-[14px] top-[14px] w-[20px] h-[20px] text-[var(--c-text-2)]" />
        </div>

        {/* Segmented Tabs */}
        <SegmentedControl
          options={[
            { id: "customer", label: "Customer" },
            { id: "owner", label: "Owner" },
          ]}
          selectedId={activeTab}
          onChange={(val) => setActiveTab(val as any)}
          data-testid="guide.tabs"
        />

        {/* Cards List */}
        <div data-testid="guide.list" className="flex flex-col gap-[12px] mt-[4px]">
          {filteredCards.length === 0 ? (
            <p className="type-body-sm text-[var(--c-text-2)] text-center py-[24px]">
              Kuch nahi mila. Dusre shabd se dhundhein.
            </p>
          ) : (
            filteredCards.map((card, idx) => (
              <GuideCard
                key={idx}
                title={card.title}
                whatIsIt={card.whatIsIt}
                whenToUse={card.whenToUse}
                howToSteps={card.howToSteps}
                keepInMind={card.keepInMind}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
