import { NextResponse } from 'next/server';
import { getProjects, saveProjects, Project } from '@/lib/data';

export async function GET() {
  const projects = getProjects();
  return NextResponse.json(projects);
}

export async function PUT(request: Request) {
  try {
    const projects: Project[] = await request.json();
    saveProjects(projects);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProject: Partial<Project> = await request.json();
    const projects = getProjects();
    
    const project: Project = {
      id: crypto.randomUUID(),
      name: newProject.name || 'New Project',
      description: newProject.description,
      status: newProject.status || 'idea',
      repo: newProject.repo,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    projects.push(project);
    saveProjects(projects);
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates }: Partial<Project> & { id: string } = await request.json();
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    saveProjects(projects);
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
