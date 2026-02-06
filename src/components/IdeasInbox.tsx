'use client';

import { useState, useCallback, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Idea {
  id: string;
  content: string;
  createdAt: string;
  tags?: string[];
  status: 'inbox' | 'developing' | 'shipped' | 'archived';
}

interface IdeasInboxProps {
  ideas: Idea[];
}

export function IdeasInbox({ ideas: initialIdeas }: IdeasInboxProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [newIdea, setNewIdea] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inboxIdeas = ideas.filter((i) => i.status === 'inbox');

  const handleAddIdea = useCallback(async () => {
    if (!newIdea.trim()) return;
    
    setIsAdding(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newIdea.trim() }),
      });
      
      if (res.ok) {
        const idea = await res.json();
        setIdeas(prev => [idea, ...prev]);
        setNewIdea('');
      }
    } catch (error) {
      console.error('Failed to add idea:', error);
    } finally {
      setIsAdding(false);
    }
  }, [newIdea]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddIdea();
    }
  }, [handleAddIdea]);

  const handleArchive = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'archived' }),
      });
      
      if (res.ok) {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: 'archived' as const } : i));
      }
    } catch (error) {
      console.error('Failed to archive idea:', error);
    }
  }, []);

  const handlePromote = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'developing' }),
      });
      
      if (res.ok) {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: 'developing' as const } : i));
      }
    } catch (error) {
      console.error('Failed to promote idea:', error);
    }
  }, []);

  return (
    <div className="space-y-3">
      {/* Quick Add Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Quick idea... (Enter to add)"
          disabled={isAdding}
          className="flex-1 px-3 py-2 text-sm bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition disabled:opacity-50"
        />
        <button
          onClick={handleAddIdea}
          disabled={isAdding || !newIdea.trim()}
          className="px-3 py-2 text-sm font-medium bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-lg hover:bg-violet-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? '...' : '+'}
        </button>
      </div>

      {/* Ideas List */}
      {inboxIdeas.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-500">No ideas in inbox</p>
          <p className="text-xs text-zinc-600 mt-1">Add ideas above or tell Max!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {inboxIdeas.map((idea) => (
            <div
              key={idea.id}
              className="group p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
            >
              <p className="text-sm text-zinc-300">{idea.content}</p>
              <div className="flex items-center gap-2 mt-2">
                {idea.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-violet-500/20 text-violet-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-zinc-600 ml-auto">
                  {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                </span>
                
                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handlePromote(idea.id)}
                    className="p-1 text-xs text-green-400/70 hover:text-green-400 transition"
                    title="Promote to developing"
                  >
                    🚀
                  </button>
                  <button
                    onClick={() => handleArchive(idea.id)}
                    className="p-1 text-xs text-zinc-500 hover:text-zinc-300 transition"
                    title="Archive"
                  >
                    ✓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {ideas.length > 0 && (
        <div className="flex gap-4 text-xs text-zinc-600 pt-2 border-t border-zinc-800/50">
          <span>{inboxIdeas.length} in inbox</span>
          <span>{ideas.filter(i => i.status === 'developing').length} developing</span>
          <span>{ideas.filter(i => i.status === 'archived').length} archived</span>
        </div>
      )}
    </div>
  );
}
