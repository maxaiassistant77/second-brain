'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  title: string;
  folder: string;
  excerpt: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (slug: string) => {
    router.push(`/doc/${encodeURIComponent(slug)}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search... ⌘K"
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.slug}
              onClick={() => handleSelect(result.slug)}
              className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition border-b border-zinc-800 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-200">{result.title}</span>
                <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                  {result.folder}
                </span>
              </div>
              {result.excerpt && (
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{result.excerpt}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
