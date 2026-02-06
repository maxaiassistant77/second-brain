import { NextResponse } from 'next/server';
import { getLifeScores, saveLifeScores, LifeScore } from '@/lib/data';

export async function GET() {
  const scores = getLifeScores();
  return NextResponse.json(scores);
}

export async function PUT(request: Request) {
  try {
    const scores: LifeScore[] = await request.json();
    saveLifeScores(scores);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { dimension, score, notes }: { dimension: string; score?: number; notes?: string } = await request.json();
    const scores = getLifeScores();
    const index = scores.findIndex(s => s.dimension === dimension);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Dimension not found' }, { status: 404 });
    }
    
    if (score !== undefined) {
      scores[index].score = Math.max(0, Math.min(100, score));
    }
    if (notes !== undefined) {
      scores[index].notes = notes;
    }
    scores[index].lastUpdated = new Date().toISOString().split('T')[0];
    
    saveLifeScores(scores);
    return NextResponse.json(scores[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
  }
}
