import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { brand } from '@/lib/brand';
import { cookies } from 'next/headers';
import { LocaleRuntime } from '@/components/LocaleRuntime';
import { RefreshControl } from '@/components/RefreshControl';
import { ThemeRuntime } from '@/components/ThemeRuntime';
const inter = localFont({ src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', variable: '--font-inter', weight: '100 900', display: 'swap' });
const devanagari = localFont({ src: '../node_modules/@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-wght-normal.woff2', variable: '--font-noto-devanagari', weight: '100 900', display: 'swap' });
export const metadata: Metadata = {
  title: { default: brand.name, template: `%s · ${brand.name}` },
  description: 'Line ka jhanjhat khatam. Token QR se.',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: brand.name, statusBarStyle: 'default' },
};
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F7F7F5', colorScheme: 'light',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const value = cookies().get('tokenapp-language')?.value;
  const theme = cookies().get('tokenapp-theme')?.value === 'dark' ? 'dark' : 'light';
  const lang = value === 'en' ? 'en' : value === 'hi-Deva' ? 'hi' : 'hi-Latn';
  return (<html lang={lang} data-theme={theme}><body className={`${inter.variable} ${devanagari.variable}`}><ThemeRuntime initialTheme={theme} /><LocaleRuntime /><RefreshControl />{children}</body></html>);
}
