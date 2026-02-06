import { NextResponse } from 'next/server';
import { getIdeas, saveIdeas, Idea } from '@/lib/data';

export async function GET() {
  const ideas = getIdeas();
  return NextResponse.json(ideas);
}

export async function PUT(request: Request) {
  try {
    const ideas: Idea[] = await request.json();
    saveIdeas(ideas);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save ideas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newIdea: Partial<Idea> = await request.json();
    const ideas = getIdeas();
    
    const idea: Idea = {
      id: crypto.randomUUID(),
      content: newIdea.content || '',
      status: newIdea.status || 'inbox',
      tags: newIdea.tags || [],
      createdAt: new Date().toISOString(),
    };
    
    ideas.unshift(idea); // Add to beginning
    saveIdeas(ideas);
    
    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates }: Partial<Idea> & { id: string } = await request.json();
    const ideas = getIdeas();
    const index = ideas.findIndex(i => i.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    ideas[index] = {
      ...ideas[index],
      ...updates,
    };
    
    saveIdeas(ideas);
    return NextResponse.json(ideas[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const ideas = getIdeas();
    const filtered = ideas.filter(i => i.id !== id);
    saveIdeas(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }
}
