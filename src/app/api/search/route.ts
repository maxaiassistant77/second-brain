import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/documents';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const documents = getDocuments();

  const results = documents
    .filter((doc) => {
      const titleMatch = doc.title.toLowerCase().includes(query);
      const contentMatch = doc.content.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    })
    .slice(0, 10)
    .map((doc) => {
      // Find excerpt with query match
      const lowerContent = doc.content.toLowerCase();
      const matchIndex = lowerContent.indexOf(query);
      let excerpt = '';
      
      if (matchIndex > -1) {
        const start = Math.max(0, matchIndex - 40);
        const end = Math.min(doc.content.length, matchIndex + query.length + 60);
        excerpt = (start > 0 ? '...' : '') + doc.content.slice(start, end).trim() + (end < doc.content.length ? '...' : '');
      }

      return {
        slug: doc.slug,
        title: doc.title,
        folder: doc.folder,
        excerpt,
      };
    });

  return NextResponse.json({ results });
}
