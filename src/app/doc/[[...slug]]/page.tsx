import { getFolderTree, getDocument } from '@/lib/documents';
import { Sidebar } from '@/components/Sidebar';
import { DocumentViewer } from '@/components/DocumentViewer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const folders = getFolderTree();
  
  if (!slug || slug.length === 0) {
    notFound();
  }
  
  const docSlug = slug.join('/');
  const doc = getDocument(docSlug);
  
  if (!doc) {
    notFound();
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <Sidebar folders={folders} activeSlug={docSlug} />
      
      <DocumentViewer
        title={doc.title}
        content={doc.content}
        modifiedAt={doc.modifiedAt.toISOString()}
        wordCount={doc.wordCount}
        folder={doc.folder}
      />
    </div>
  );
}
