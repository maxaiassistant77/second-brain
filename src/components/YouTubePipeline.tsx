'use client';

interface YouTubeVideo {
  id: string;
  title: string;
  status: 'idea' | 'scripted' | 'filming' | 'editing' | 'published';
  notes?: string;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface YouTubePipelineProps {
  videos: YouTubeVideo[];
}

const stages = [
  { key: 'idea', label: '💡 Ideas', color: 'border-blue-500/30 bg-blue-500/10' },
  { key: 'scripted', label: '📝 Scripted', color: 'border-yellow-500/30 bg-yellow-500/10' },
  { key: 'filming', label: '🎬 Filming', color: 'border-orange-500/30 bg-orange-500/10' },
  { key: 'editing', label: '✂️ Editing', color: 'border-purple-500/30 bg-purple-500/10' },
  { key: 'published', label: '🚀 Published', color: 'border-green-500/30 bg-green-500/10' },
] as const;

export function YouTubePipeline({ videos }: YouTubePipelineProps) {
  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        const stageVideos = videos.filter((v) => v.status === stage.key);
        
        return (
          <div key={stage.key}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-zinc-400">{stage.label}</span>
              <span className="text-xs text-zinc-600">({stageVideos.length})</span>
            </div>
            
            {stageVideos.length > 0 ? (
              <div className="space-y-1">
                {stageVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`px-3 py-2 rounded-lg border ${stage.color} transition hover:scale-[1.01]`}
                  >
                    <span className="text-sm text-zinc-300">{video.title}</span>
                    {video.publishedUrl && (
                      <a
                        href={video.publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`px-3 py-2 rounded-lg border border-dashed ${stage.color} opacity-50`}>
                <span className="text-xs text-zinc-600">Empty</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
