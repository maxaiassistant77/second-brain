'use client';

import { useState, useCallback, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  { key: 'idea' as const, label: '💡 Ideas', color: 'border-blue-500/30 bg-blue-500/10', dragOver: 'border-blue-500 bg-blue-500/20' },
  { key: 'scripted' as const, label: '📝 Scripted', color: 'border-yellow-500/30 bg-yellow-500/10', dragOver: 'border-yellow-500 bg-yellow-500/20' },
  { key: 'filming' as const, label: '🎬 Filming', color: 'border-orange-500/30 bg-orange-500/10', dragOver: 'border-orange-500 bg-orange-500/20' },
  { key: 'editing' as const, label: '✂️ Editing', color: 'border-purple-500/30 bg-purple-500/10', dragOver: 'border-purple-500 bg-purple-500/20' },
  { key: 'published' as const, label: '🚀 Published', color: 'border-green-500/30 bg-green-500/10', dragOver: 'border-green-500 bg-green-500/20' },
];

type StageKey = typeof stages[number]['key'];

// Sortable Video Card
function SortableVideoCard({ video, stage }: { video: YouTubeVideo; stage: typeof stages[number] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-3 py-2 rounded-lg border ${stage.color} transition cursor-grab active:cursor-grabbing hover:scale-[1.01]`}
    >
      <span className="text-sm text-zinc-300">{video.title}</span>
      {video.notes && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{video.notes}</p>
      )}
      {video.publishedUrl && (
        <a
          href={video.publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-2 text-xs text-zinc-500 hover:text-zinc-300"
        >
          ↗
        </a>
      )}
    </div>
  );
}

// Overlay Card
function VideoCardOverlay({ video }: { video: YouTubeVideo }) {
  const stage = stages.find(s => s.key === video.status) || stages[0];
  return (
    <div className={`px-3 py-2 rounded-lg border ${stage.color} shadow-2xl ring-2 ring-white/30 scale-105`}>
      <span className="text-sm text-zinc-300">{video.title}</span>
    </div>
  );
}

// Droppable Stage
function DroppableStage({ stage, videos, isOver }: { stage: typeof stages[number]; videos: YouTubeVideo[]; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: stage.key });

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-zinc-400">{stage.label}</span>
        <span className="text-xs text-zinc-600">({videos.length})</span>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-1 min-h-[60px] p-2 rounded-lg transition-all ${
          isOver ? `${stage.dragOver} ring-2 ring-dashed` : 'bg-transparent'
        }`}
      >
        <SortableContext items={videos.map(v => v.id)} strategy={verticalListSortingStrategy}>
          {videos.map((video) => (
            <SortableVideoCard key={video.id} video={video} stage={stage} />
          ))}
        </SortableContext>

        {videos.length === 0 && (
          <div className={`px-3 py-2 rounded-lg border border-dashed ${
            isOver ? stage.dragOver : stage.color
          } opacity-50 text-center`}>
            <span className="text-xs text-zinc-600">{isOver ? 'Drop here' : 'Empty'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function YouTubePipeline({ videos: initialVideos }: YouTubePipelineProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const stageKeys = stages.map(s => s.key);

  const handleAddVideo = useCallback(async () => {
    if (!newVideoTitle.trim()) return;
    
    setIsAdding(true);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newVideoTitle.trim(), status: 'idea' }),
      });
      
      if (res.ok) {
        const video = await res.json();
        setVideos(prev => [...prev, video]);
        setNewVideoTitle('');
      }
    } catch (error) {
      console.error('Failed to add video:', error);
    } finally {
      setIsAdding(false);
    }
  }, [newVideoTitle]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const video = videos.find(v => v.id === active.id);
    if (video) setActiveVideo(video);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveVideo(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a stage
    const targetStatus = stageKeys.includes(overId as StageKey) ? overId as StageKey : null;

    if (!targetStatus) {
      // Dropped on another video - find that video's status
      const overVideo = videos.find(v => v.id === overId);
      if (!overVideo) return;

      const newStatus = overVideo.status;
      const activeVideoItem = videos.find(v => v.id === activeId);

      if (activeVideoItem && activeVideoItem.status !== newStatus) {
        const updatedVideos = videos.map(v =>
          v.id === activeId ? { ...v, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : v
        );
        setVideos(updatedVideos);

        await fetch('/api/youtube', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: activeId, status: newStatus }),
        });
      }
      return;
    }

    // Dropped on a stage
    const activeVideoItem = videos.find(v => v.id === activeId);
    if (activeVideoItem && activeVideoItem.status !== targetStatus) {
      const updatedVideos = videos.map(v =>
        v.id === activeId ? { ...v, status: targetStatus, updatedAt: new Date().toISOString().split('T')[0] } : v
      );
      setVideos(updatedVideos);

      await fetch('/api/youtube', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeId, status: targetStatus }),
      });
    }
  }, [videos, stageKeys]);

  return (
    <div className="space-y-4">
      {/* Quick Add */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newVideoTitle}
          onChange={(e) => setNewVideoTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
          placeholder="New video idea... (Enter to add)"
          disabled={isAdding}
          className="flex-1 px-3 py-2 text-sm bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition disabled:opacity-50"
        />
        <button
          onClick={handleAddVideo}
          disabled={isAdding || !newVideoTitle.trim()}
          className="px-4 py-2 text-sm font-medium bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? '...' : '+ Add'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          {stages.map((stage) => {
            const stageVideos = videos.filter((v) => v.status === stage.key);
            const isOver = overId === stage.key || stageVideos.some(v => v.id === overId);

            return (
              <DroppableStage
                key={stage.key}
                stage={stage}
                videos={stageVideos}
                isOver={isOver && activeVideo?.status !== stage.key}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeVideo ? <VideoCardOverlay video={activeVideo} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
