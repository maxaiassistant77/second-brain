'use client';

import { ReactNode } from 'react';
import { ToastProvider } from './Toast';
import { CommandPalette } from './CommandPalette';
import { KeyboardShortcuts } from './KeyboardShortcuts';

interface ProvidersProps {
  children: ReactNode;
  documents?: { slug: string; title: string; folder: string }[];
}

export function Providers({ children, documents = [] }: ProvidersProps) {
  return (
    <ToastProvider>
      <KeyboardShortcuts />
      {children}
      <CommandPalette documents={documents} />
    </ToastProvider>
  );
}
