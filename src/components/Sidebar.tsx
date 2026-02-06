'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FolderTree {
  name: string;
  path: string;
  documents: { slug: string; title: string; path: string }[];
}

interface SidebarProps {
  folders: FolderTree[];
  activeSlug?: string;
}

const folderIcons: Record<string, string> = {
  journals: '📓',
  concepts: '💡',
  research: '🔬',
  projects: '🚀',
  root: '📁',
};

const folderLabels: Record<string, string> = {
  journals: 'Journals',
  concepts: 'Concepts',
  research: 'Research',
  projects: 'Projects',
  root: 'Documents',
};

export function Sidebar({ folders, activeSlug }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    folders.forEach(f => initial[f.name] = true);
    return initial;
  });

  const toggle = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <span>🧠</span>
          <span>Second Brain</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        {folders.map(folder => (
          <div key={folder.name} className="mb-2">
            <button
              onClick={() => toggle(folder.name)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded transition"
            >
              <span className="text-base">{folderIcons[folder.name] || '📁'}</span>
              <span className="font-medium">{folderLabels[folder.name] || folder.name}</span>
              <span className="ml-auto text-xs text-zinc-600">{folder.documents.length}</span>
              <svg
                className={`w-3 h-3 transition-transform ${expanded[folder.name] ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {expanded[folder.name] && (
              <div className="ml-4 mt-1 space-y-0.5">
                {folder.documents.map(doc => (
                  <Link
                    key={doc.slug}
                    href={`/doc/${encodeURIComponent(doc.slug)}`}
                    className={`block px-2 py-1 text-sm rounded transition truncate ${
                      activeSlug === doc.slug
                        ? 'bg-violet-600/20 text-violet-300'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                    }`}
                  >
                    {doc.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600">
        {folders.reduce((acc, f) => acc + f.documents.length, 0)} documents
      </div>
    </aside>
  );
}
