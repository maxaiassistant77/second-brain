'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';

interface Command {
  id: string;
  name: string;
  shortcut?: string;
  icon: string;
  action: () => void | Promise<void>;
  group: 'navigation' | 'actions' | 'documents';
}

interface CommandPaletteProps {
  documents?: { slug: string; title: string; folder: string }[];
}

export function CommandPalette({ documents = [] }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    // Navigation
    {
      id: 'dashboard',
      name: 'Go to Dashboard',
      shortcut: 'g d',
      icon: '🏠',
      action: () => router.push('/'),
      group: 'navigation',
    },
    // Actions
    {
      id: 'new-project',
      name: 'Create new project',
      shortcut: 'n p',
      icon: '🚀',
      action: async () => {
        const name = prompt('Project name:');
        if (name?.trim()) {
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim(), status: 'idea' }),
          });
          router.refresh();
        }
      },
      group: 'actions',
    },
    {
      id: 'new-idea',
      name: 'Add new idea',
      shortcut: 'n i',
      icon: '💡',
      action: async () => {
        const content = prompt('Idea:');
        if (content?.trim()) {
          await fetch('/api/ideas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content.trim() }),
          });
          router.refresh();
        }
      },
      group: 'actions',
    },
    {
      id: 'new-video',
      name: 'Add video idea',
      shortcut: 'n v',
      icon: '🎬',
      action: async () => {
        const title = prompt('Video title:');
        if (title?.trim()) {
          await fetch('/api/youtube', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title.trim(), status: 'idea' }),
          });
          router.refresh();
        }
      },
      group: 'actions',
    },
    // Documents
    ...documents.map((doc) => ({
      id: `doc-${doc.slug}`,
      name: doc.title,
      icon: doc.folder === 'journals' ? '📓' : doc.folder === 'research' ? '🔬' : doc.folder === 'projects' ? '🚀' : '📄',
      action: () => router.push(`/doc/${encodeURIComponent(doc.slug)}`),
      group: 'documents' as const,
    })),
  ];

  const filteredCommands = query
    ? commands.filter((cmd) =>
        cmd.name.toLowerCase().includes(query.toLowerCase())
      )
    : commands.filter((cmd) => cmd.group !== 'documents');

  const groupedCommands = {
    navigation: filteredCommands.filter((c) => c.group === 'navigation'),
    actions: filteredCommands.filter((c) => c.group === 'actions'),
    documents: filteredCommands.filter((c) => c.group === 'documents'),
  };

  // Open/close with ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          setQuery('');
          setSelectedIndex(0);
        }
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          setIsOpen(false);
        }
      }
    },
    [filteredCommands, selectedIndex]
  );

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl animate-in slide-in-from-top-4 fade-in duration-200">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <svg
              className="w-5 h-5 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands or documents..."
              className="flex-1 bg-transparent text-zinc-200 placeholder:text-zinc-600 outline-none text-sm"
            />
            <kbd className="px-2 py-0.5 text-xs text-zinc-500 bg-zinc-800 rounded">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {Object.entries(groupedCommands).map(([group, cmds]) => {
              if (cmds.length === 0) return null;
              return (
                <div key={group} className="mb-2 last:mb-0">
                  <div className="px-2 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    {group}
                  </div>
                  {cmds.map((cmd) => {
                    flatIndex++;
                    const isSelected = flatIndex === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                          isSelected
                            ? 'bg-violet-600/30 text-zinc-100'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-base">{cmd.icon}</span>
                        <span className="flex-1 text-left text-sm">{cmd.name}</span>
                        {cmd.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-xs text-zinc-500 bg-zinc-800 rounded">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {filteredCommands.length === 0 && (
              <div className="py-8 text-center text-zinc-500 text-sm">
                No results found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-zinc-800 rounded">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-zinc-800 rounded">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-zinc-800 rounded">esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
