import { NextResponse } from 'next/server';
import { getYouTubeVideos, saveYouTubeVideos, YouTubeVideo } from '@/lib/data';

export async function GET() {
  const videos = getYouTubeVideos();
  return NextResponse.json(videos);
}

export async function PUT(request: Request) {
  try {
    const videos: YouTubeVideo[] = await request.json();
    saveYouTubeVideos(videos);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save videos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newVideo: Partial<YouTubeVideo> = await request.json();
    const videos = getYouTubeVideos();
    
    const video: YouTubeVideo = {
      id: crypto.randomUUID(),
      title: newVideo.title || 'New Video',
      status: newVideo.status || 'idea',
      notes: newVideo.notes,
      publishedUrl: newVideo.publishedUrl,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    videos.push(video);
    saveYouTubeVideos(videos);
    
    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates }: Partial<YouTubeVideo> & { id: string } = await request.json();
    const videos = getYouTubeVideos();
    const index = videos.findIndex(v => v.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    videos[index] = {
      ...videos[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    saveYouTubeVideos(videos);
    return NextResponse.json(videos[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}
