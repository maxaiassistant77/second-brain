'use client';

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
  idea: { label: 'Ideas', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  active: { label: 'Active', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  paused: { label: 'Paused', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  shipped: { label: 'Shipped', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  archived: { label: 'Archived', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
};

export function ProjectsBoard({ projects }: ProjectsBoardProps) {
  const columns = ['idea', 'active', 'paused', 'shipped'] as const;

  return (
    <div className="grid grid-cols-4 gap-3">
      {columns.map((status) => {
        const config = statusConfig[status];
        const columnProjects = projects.filter((p) => p.status === status);

        return (
          <div key={status} className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                {config.label}
              </span>
              <span className="text-xs text-zinc-600">{columnProjects.length}</span>
            </div>

            <div className="space-y-2 min-h-[100px]">
              {columnProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 rounded-lg border ${config.color} transition hover:scale-[1.02]`}
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
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 mt-2"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
