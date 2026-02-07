'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', emoji: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', emoji: '🌤️' };
  } else if (hour >= 17 && hour < 21) {
    return { text: 'Good evening', emoji: '🌅' };
  } else {
    return { text: 'Night owl mode', emoji: '🦉' };
  }
}

function getMotivationalQuote(): string {
  const quotes = [
    "Build something awesome today.",
    "One step at a time.",
    "Ideas become reality with action.",
    "Your future self will thank you.",
    "Ship it.",
    "Progress over perfection.",
    "Let's make it happen.",
    "Focus mode: activated.",
    "Ready to create?",
    "Today's a good day to build.",
  ];
  
  // Use a deterministic "random" based on the day
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return quotes[dayIndex % quotes.length];
}

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting();
  const quote = getMotivationalQuote();

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (!mounted) {
    return (
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Loading...</p>
        </div>
        <div className="w-64">
          <SearchBar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{greeting.emoji}</span>
          <h1 className="text-2xl font-bold text-zinc-100">
            {greeting.text}, Zach
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-zinc-500">{dateStr}</p>
          <span className="text-zinc-700">•</span>
          <p className="text-sm text-zinc-600">{timeStr}</p>
        </div>
        <p className="text-sm text-violet-400/70 mt-2 italic">{quote}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-64">
          <SearchBar />
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">⌘K</kbd>
          <span>commands</span>
        </div>
      </div>
    </div>
  );
}
