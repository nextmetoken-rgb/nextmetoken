import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND_NAME } from "@/config/brand";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { QueueProvider } from "@/context/QueueContext";

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "Line ka jhanjhat khatam. Token QR se.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F7F5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" dir="ltr" className="h-full bg-[var(--c-bg)]">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-dvh font-sans antialiased text-[var(--c-text)] bg-[var(--c-bg)]">
        <SettingsProvider>
          <AuthProvider>
            <QueueProvider>
              <div className="app-shell min-h-dvh flex flex-col">
                {children}
              </div>
            </QueueProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
