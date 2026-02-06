'use client';

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

export function IdeasInbox({ ideas }: IdeasInboxProps) {
  const inboxIdeas = ideas.filter((i) => i.status === 'inbox');

  if (inboxIdeas.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
        <p className="text-zinc-500">No ideas in inbox</p>
        <p className="text-xs text-zinc-600 mt-1">Tell Max your ideas anytime!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {inboxIdeas.map((idea) => (
        <div
          key={idea.id}
          className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition"
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
          </div>
        </div>
      ))}
    </div>
  );
}
