'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';

interface DocumentViewerProps {
  title: string;
  content: string;
  modifiedAt: string;
  wordCount: number;
  folder: string;
}

export function DocumentViewer({ title, content, modifiedAt, wordCount, folder }: DocumentViewerProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <span className="px-2 py-0.5 bg-zinc-800 rounded">{folder}</span>
            <span>•</span>
            <span>{format(new Date(modifiedAt), 'MMM d, yyyy')}</span>
            <span>•</span>
            <span>{wordCount.toLocaleString()} words</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">{title}</h1>
        </div>
        
        {/* Content */}
        <article className="prose prose-invert prose-zinc max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-zinc-200 mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium text-zinc-300 mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-zinc-400 leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-zinc-400 mb-4 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-zinc-400 mb-4 space-y-1">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-zinc-400">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-violet-500 pl-4 italic text-zinc-500 my-4">
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto my-4">
                      <code className="text-sm text-zinc-300">{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-violet-300">
                    {children}
                  </code>
                );
              },
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-zinc-200">{children}</strong>
              ),
              hr: () => <hr className="border-zinc-800 my-8" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
