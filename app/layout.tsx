import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-devanagari';
import './globals.css';
import { brand } from '@/lib/brand';
export const metadata: Metadata = {
  title: brand.name,
  description: 'Line ka jhanjhat khatam. Token QR se.',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: brand.name, statusBarStyle: 'default' },
};
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F7F7F5', colorScheme: 'light',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="hi"><body>{children}</body></html>);
}
