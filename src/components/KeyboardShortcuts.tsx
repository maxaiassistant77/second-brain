'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const now = Date.now();
      const key = e.key.toLowerCase();

      // Two-key shortcuts (g d, n p, etc.)
      if (now - lastKeyTime < 500) {
        const combo = `${lastKey} ${key}`;

        switch (combo) {
          case 'g d':
            e.preventDefault();
            router.push('/');
            break;
          case 'g h':
            e.preventDefault();
            router.push('/');
            break;
        }
      }

      // Single key shortcuts
      switch (key) {
        case '?':
          // Show shortcuts help (could expand this)
          console.log('Shortcuts: ⌘K search, g+d dashboard');
          break;
      }

      lastKey = key;
      lastKeyTime = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
