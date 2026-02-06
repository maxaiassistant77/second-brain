import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = '/Users/maxbot/.openclaw/workspace/second-brain';

export interface Document {
  slug: string;
  path: string;
  folder: string;
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  modifiedAt: Date;
  wordCount: number;
}

export interface FolderTree {
  name: string;
  path: string;
  documents: { slug: string; title: string; path: string }[];
}

function getTitle(content: string, filename: string): string {
  // Try to get title from first H1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  
  // Fall back to filename
  return filename.replace(/\.md$/, '').replace(/-/g, ' ');
}

export function getDocuments(): Document[] {
  const documents: Document[] = [];
  
  function scanDir(dir: string, folder: string = '') {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath, entry.name);
      } else if (entry.name.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(raw);
        const stats = fs.statSync(fullPath);
        const slug = `${folder}/${entry.name.replace(/\.md$/, '')}`;
        
        documents.push({
          slug,
          path: fullPath,
          folder: folder || 'root',
          title: (data.title as string) || getTitle(content, entry.name),
          content,
          frontmatter: data,
          modifiedAt: stats.mtime,
          wordCount: content.split(/\s+/).filter(Boolean).length,
        });
      }
    }
  }
  
  scanDir(DOCS_DIR);
  return documents.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
}

export function getFolderTree(): FolderTree[] {
  const documents = getDocuments();
  const folders = new Map<string, FolderTree>();
  
  for (const doc of documents) {
    if (!folders.has(doc.folder)) {
      folders.set(doc.folder, {
        name: doc.folder,
        path: doc.folder,
        documents: [],
      });
    }
    folders.get(doc.folder)!.documents.push({
      slug: doc.slug,
      title: doc.title,
      path: doc.path,
    });
  }
  
  // Sort folders in preferred order
  const order = ['journals', 'concepts', 'research', 'projects', 'root'];
  return Array.from(folders.values()).sort((a, b) => {
    const aIdx = order.indexOf(a.name);
    const bIdx = order.indexOf(b.name);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });
}

export function getDocument(slug: string): Document | null {
  const documents = getDocuments();
  return documents.find(d => d.slug === slug) || null;
}
