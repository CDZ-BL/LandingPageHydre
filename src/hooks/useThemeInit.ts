'use client';

import { useEffect } from 'react';
import { useHydreStore } from '@/lib/store';

/**
 * Reads theme from localStorage and syncs with Zustand store.
 * Must be called once from a layout-level client component.
 */
export function useThemeInit() {
  const setTheme = useHydreStore((s) => s.setTheme);

  useEffect(() => {
    const saved = localStorage.getItem('hydre-theme') as 'dark' | 'light' | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, [setTheme]);
}
