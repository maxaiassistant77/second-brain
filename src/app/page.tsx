import { getFolderTree, getDocuments } from '@/lib/documents';
import { Sidebar } from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

export default function Home() {
  const folders = getFolderTree();
  const documents = getDocuments();
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <Sidebar folders={folders} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">
              Welcome to Your Second Brain 🧠
            </h1>
            <p className="text-lg text-zinc-400">
              Your living knowledge base — concepts, journals, research, and project notes all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {folders.map(folder => (
              <div
                key={folder.name}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
              >
                <div className="text-2xl font-bold text-zinc-100">
                  {folder.documents.length}
                </div>
                <div className="text-sm text-zinc-500 capitalize">{folder.name}</div>
              </div>
            ))}
          </div>

          {/* Recent Documents */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-200 mb-4">Recent Documents</h2>
            <div className="space-y-2">
              {recentDocs.map(doc => (
                <a
                  key={doc.slug}
                  href={`/doc/${encodeURIComponent(doc.slug)}`}
                  className="block p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:bg-zinc-900/50 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-zinc-200">{doc.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        {doc.folder} • {doc.wordCount.toLocaleString()} words
                      </p>
                    </div>
                    <div className="text-xs text-zinc-600">
                      {new Date(doc.modifiedAt).toLocaleDateString()}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
