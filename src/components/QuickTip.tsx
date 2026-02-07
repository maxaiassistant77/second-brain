'use client';

import { useState, useEffect } from 'react';

const tips = [
  { emoji: '⌨️', tip: 'Press ⌘K to open the command palette' },
  { emoji: '🎯', tip: 'Click the Life Score bars to adjust your ratings' },
  { emoji: '🚀', tip: 'Drag projects between columns to update status' },
  { emoji: '💡', tip: 'Quick-add ideas with Enter in the Ideas Inbox' },
  { emoji: '🎬', tip: 'Drag videos through your YouTube pipeline' },
  { emoji: '📝', tip: 'Search documents by content with the search bar' },
  { emoji: '🔄', tip: 'Max keeps track of your activity automatically' },
];

export function QuickTip() {
  const [tip, setTip] = useState(tips[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show a different tip each time based on the current minute
    const index = Math.floor(Date.now() / 60000) % tips.length;
    setTip(tips[index]);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs text-zinc-500 backdrop-blur-sm">
      <span>{tip.emoji}</span>
      <span>{tip.tip}</span>
    </div>
  );
}
