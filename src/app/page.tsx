import { getFolderTree, getDocuments } from '@/lib/documents';
import { getRecentActivity } from '@/lib/activity';
import { getProjects, getIdeas, getLifeScores, getYouTubeVideos } from '@/lib/data';
import { Sidebar } from '@/components/Sidebar';
import { ActivityFeed } from '@/components/ActivityFeed';
import { LifeScoreDashboard } from '@/components/LifeScoreDashboard';
import { ProjectsBoard } from '@/components/ProjectsBoard';
import { IdeasInbox } from '@/components/IdeasInbox';
import { YouTubePipeline } from '@/components/YouTubePipeline';
import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const folders = getFolderTree();
  const documents = getDocuments();
  const recentDocs = documents.slice(0, 3);
  const activities = getRecentActivity();
  const projects = getProjects();
  const ideas = getIdeas();
  const lifeScores = getLifeScores();
  const youtubeVideos = getYouTubeVideos();

  // Convert dates to strings for client components
  const activitiesForClient = activities.map(a => ({
    ...a,
    timestamp: a.timestamp.toISOString(),
  }));

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <Sidebar folders={folders} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="w-64">
              <SearchBar />
            </div>
          </div>

          {/* Top Row: Life Score + Activity */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Life Score */}
            <div className="col-span-3 bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Life Score
              </h2>
              <LifeScoreDashboard scores={lifeScores} />
            </div>

            {/* Activity Feed */}
            <div className="col-span-5 bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span>⚡</span> Max&apos;s Activity
              </h2>
              <ActivityFeed activities={activitiesForClient} />
            </div>

            {/* Quick Stats + Recent Docs */}
            <div className="col-span-4 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{documents.length}</div>
                  <div className="text-xs text-zinc-500">Documents</div>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{projects.filter(p => p.status === 'active').length}</div>
                  <div className="text-xs text-zinc-500">Active Projects</div>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{ideas.length}</div>
                  <div className="text-xs text-zinc-500">Ideas</div>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{youtubeVideos.filter(v => v.status !== 'published').length}</div>
                  <div className="text-xs text-zinc-500">Videos in Pipeline</div>
                </div>
              </div>

              {/* Recent Docs */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-zinc-300 mb-3">📄 Recent Docs</h2>
                <div className="space-y-2">
                  {recentDocs.map(doc => (
                    <Link
                      key={doc.slug}
                      href={`/doc/${encodeURIComponent(doc.slug)}`}
                      className="block p-2 hover:bg-zinc-800/50 rounded transition"
                    >
                      <div className="text-sm text-zinc-300 truncate">{doc.title}</div>
                      <div className="text-xs text-zinc-600">{doc.folder}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Board */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 mb-6">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <span>🚀</span> Projects
            </h2>
            <ProjectsBoard projects={projects} />
          </div>

          {/* Bottom Row: Ideas + YouTube */}
          <div className="grid grid-cols-2 gap-6">
            {/* Ideas Inbox */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span>💡</span> Ideas Inbox
              </h2>
              <IdeasInbox ideas={ideas} />
            </div>

            {/* YouTube Pipeline */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span>🎬</span> YouTube Pipeline
              </h2>
              <YouTubePipeline videos={youtubeVideos} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
