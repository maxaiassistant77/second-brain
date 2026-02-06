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

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'idea' | 'active' | 'paused' | 'shipped' | 'archived';
  repo?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsBoardProps {
  projects: Project[];
}

const statusConfig = {
  idea: { label: 'Ideas', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', hoverBg: 'bg-blue-500/30' },
  active: { label: 'Active', color: 'bg-green-500/20 text-green-300 border-green-500/30', hoverBg: 'bg-green-500/30' },
  paused: { label: 'Paused', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', hoverBg: 'bg-yellow-500/30' },
  shipped: { label: 'Shipped', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30', hoverBg: 'bg-violet-500/30' },
  archived: { label: 'Archived', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', hoverBg: 'bg-zinc-500/30' },
};

type StatusKey = keyof typeof statusConfig;

// Sortable Project Card
function SortableProjectCard({ project, config, isDragging }: { project: Project; config: typeof statusConfig[StatusKey]; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isCurrentlyDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 rounded-lg border ${config.color} transition cursor-grab active:cursor-grabbing hover:scale-[1.02] ${isDragging ? 'shadow-lg ring-2 ring-white/20' : ''}`}
    >
      <h4 className="font-medium text-sm text-zinc-200">{project.name}</h4>
      {project.description && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
          {project.description}
        </p>
      )}
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 mt-2"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
      )}
    </div>
  );
}

// Overlay Card (shown while dragging)
function ProjectCardOverlay({ project }: { project: Project }) {
  const config = statusConfig[project.status];
  return (
    <div className={`p-3 rounded-lg border ${config.color} shadow-2xl ring-2 ring-white/30 scale-105`}>
      <h4 className="font-medium text-sm text-zinc-200">{project.name}</h4>
      {project.description && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{project.description}</p>
      )}
    </div>
  );
}

// Droppable Column
function DroppableColumn({ status, projects, isOver }: { status: StatusKey; projects: Project[]; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: status });
  const config = statusConfig[status];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {config.label}
        </span>
        <span className="text-xs text-zinc-600">{projects.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[120px] p-2 rounded-lg transition-colors ${
          isOver ? 'bg-zinc-800/50 ring-2 ring-dashed ring-zinc-600' : 'bg-transparent'
        }`}
      >
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {projects.map((project) => (
            <SortableProjectCard key={project.id} project={project} config={config} />
          ))}
        </SortableContext>
        
        {projects.length === 0 && (
          <div className={`p-4 border-2 border-dashed rounded-lg text-center ${
            isOver ? 'border-zinc-500 bg-zinc-800/30' : 'border-zinc-800'
          }`}>
            <span className="text-xs text-zinc-600">Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsBoard({ projects: initialProjects }: ProjectsBoardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const columns: StatusKey[] = ['idea', 'active', 'paused', 'shipped'];

  const handleAddProject = useCallback(async () => {
    if (!newProjectName.trim()) return;
    
    setIsAdding(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim(), status: 'idea' }),
      });
      
      if (res.ok) {
        const project = await res.json();
        setProjects(prev => [...prev, project]);
        setNewProjectName('');
      }
    } catch (error) {
      console.error('Failed to add project:', error);
    } finally {
      setIsAdding(false);
    }
  }, [newProjectName]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = projects.find(p => p.id === active.id);
    if (project) setActiveProject(project);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a column
    const targetStatus = columns.includes(overId as StatusKey) ? overId as StatusKey : null;
    
    if (!targetStatus) {
      // Dropped on another project - find that project's status
      const overProject = projects.find(p => p.id === overId);
      if (!overProject) return;
      
      const newStatus = overProject.status;
      const activeProject = projects.find(p => p.id === activeId);
      
      if (activeProject && activeProject.status !== newStatus) {
        const updatedProjects = projects.map(p =>
          p.id === activeId ? { ...p, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : p
        );
        setProjects(updatedProjects);
        
        // Persist to server
        await fetch('/api/projects', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: activeId, status: newStatus }),
        });
      }
      return;
    }

    // Dropped on a column
    const activeProject = projects.find(p => p.id === activeId);
    if (activeProject && activeProject.status !== targetStatus) {
      const updatedProjects = projects.map(p =>
        p.id === activeId ? { ...p, status: targetStatus, updatedAt: new Date().toISOString().split('T')[0] } : p
      );
      setProjects(updatedProjects);
      
      // Persist to server
      await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeId, status: targetStatus }),
      });
    }
  }, [projects, columns]);

  return (
    <div className="space-y-4">
      {/* Quick Add */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
          placeholder="New project name... (Enter to add)"
          disabled={isAdding}
          className="flex-1 px-3 py-2 text-sm bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition disabled:opacity-50"
        />
        <button
          onClick={handleAddProject}
          disabled={isAdding || !newProjectName.trim()}
          className="px-4 py-2 text-sm font-medium bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-lg hover:bg-violet-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="grid grid-cols-4 gap-3">
          {columns.map((status) => {
            const columnProjects = projects.filter((p) => p.status === status);
            const isOver = overId === status || columnProjects.some(p => p.id === overId);

            return (
              <DroppableColumn
                key={status}
                status={status}
                projects={columnProjects}
                isOver={isOver && activeProject?.status !== status}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeProject ? <ProjectCardOverlay project={activeProject} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
