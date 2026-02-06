import fs from 'fs';
import path from 'path';

const DATA_DIR = '/Users/maxbot/.openclaw/workspace/second-brain/data';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ideas
export interface Idea {
  id: string;
  content: string;
  createdAt: string;
  tags?: string[];
  status: 'inbox' | 'developing' | 'shipped' | 'archived';
}

export function getIdeas(): Idea[] {
  const filePath = path.join(DATA_DIR, 'ideas.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function saveIdeas(ideas: Idea[]): void {
  const filePath = path.join(DATA_DIR, 'ideas.json');
  fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
}

// Projects
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'idea' | 'active' | 'paused' | 'shipped' | 'archived';
  repo?: string;
  createdAt: string;
  updatedAt: string;
}

export function getProjects(): Project[] {
  const filePath = path.join(DATA_DIR, 'projects.json');
  if (!fs.existsSync(filePath)) {
    // Seed with known projects
    const initial: Project[] = [
      { id: '1', name: 'YouTube Helper', description: 'Video analysis with Gemini for titles, descriptions, tags', status: 'active', repo: 'https://github.com/maxaiassistant77/youtube-helper', createdAt: '2026-02-05', updatedAt: '2026-02-05' },
      { id: '2', name: 'Second Brain', description: 'Living knowledge base - Obsidian × Linear', status: 'active', repo: 'https://github.com/maxaiassistant77/second-brain', createdAt: '2026-02-05', updatedAt: '2026-02-05' },
      { id: '3', name: 'Game of Life', description: 'Gamifying personal evolution across 7 dimensions', status: 'idea', createdAt: '2026-02-05', updatedAt: '2026-02-05' },
    ];
    saveProjects(initial);
    return initial;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function saveProjects(projects: Project[]): void {
  const filePath = path.join(DATA_DIR, 'projects.json');
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
}

// Life Score (7 Dimensions)
export interface LifeScore {
  dimension: string;
  score: number; // 0-100
  emoji: string;
  notes?: string;
  lastUpdated: string;
}

export function getLifeScores(): LifeScore[] {
  const filePath = path.join(DATA_DIR, 'life-scores.json');
  if (!fs.existsSync(filePath)) {
    const initial: LifeScore[] = [
      { dimension: 'Mental', score: 50, emoji: '🧠', lastUpdated: '2026-02-05' },
      { dimension: 'Physical', score: 50, emoji: '💪', lastUpdated: '2026-02-05' },
      { dimension: 'Emotional', score: 50, emoji: '❤️', lastUpdated: '2026-02-05' },
      { dimension: 'Social', score: 50, emoji: '👥', lastUpdated: '2026-02-05' },
      { dimension: 'Financial', score: 50, emoji: '💰', lastUpdated: '2026-02-05' },
      { dimension: 'Relational', score: 50, emoji: '💕', lastUpdated: '2026-02-05' },
      { dimension: 'Spiritual', score: 50, emoji: '✨', lastUpdated: '2026-02-05' },
    ];
    saveLifeScores(initial);
    return initial;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function saveLifeScores(scores: LifeScore[]): void {
  const filePath = path.join(DATA_DIR, 'life-scores.json');
  fs.writeFileSync(filePath, JSON.stringify(scores, null, 2));
}

// YouTube Pipeline
export interface YouTubeVideo {
  id: string;
  title: string;
  status: 'idea' | 'scripted' | 'filming' | 'editing' | 'published';
  notes?: string;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function getYouTubeVideos(): YouTubeVideo[] {
  const filePath = path.join(DATA_DIR, 'youtube-pipeline.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function saveYouTubeVideos(videos: YouTubeVideo[]): void {
  const filePath = path.join(DATA_DIR, 'youtube-pipeline.json');
  fs.writeFileSync(filePath, JSON.stringify(videos, null, 2));
}
