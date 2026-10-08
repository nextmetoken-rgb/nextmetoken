'use client';
import { useEffect } from 'react';

export function ThemeRuntime({ initialTheme }: { initialTheme: 'light' | 'dark' }) {
  useEffect(() => {
    const saved = localStorage.getItem('tokenapp-theme');
    const theme = saved === 'dark' || saved === 'light' ? saved : initialTheme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [initialTheme]);
  return null;
}

export function saveTheme(theme: 'light' | 'dark') {
  localStorage.setItem('tokenapp-theme', theme);
  document.cookie = `tokenapp-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
