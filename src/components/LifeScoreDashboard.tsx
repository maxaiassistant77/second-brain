'use client';

import { useState, useCallback } from 'react';

interface LifeScore {
  dimension: string;
  score: number;
  emoji: string;
  notes?: string;
  lastUpdated: string;
}

interface LifeScoreDashboardProps {
  scores: LifeScore[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-emerald-500';
  if (score >= 40) return 'bg-yellow-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-green-600/20 to-emerald-600/20 border-green-500/30';
  if (score >= 60) return 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30';
  if (score >= 40) return 'from-yellow-600/20 to-amber-600/20 border-yellow-500/30';
  if (score >= 20) return 'from-orange-600/20 to-red-600/20 border-orange-500/30';
  return 'from-red-600/20 to-rose-600/20 border-red-500/30';
}

export function LifeScoreDashboard({ scores: initialScores }: LifeScoreDashboardProps) {
  const [scores, setScores] = useState<LifeScore[]>(initialScores);
  const [editingDimension, setEditingDimension] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalScore = Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length);

  const handleScoreChange = useCallback(async (dimension: string, newScore: number) => {
    const clampedScore = Math.max(0, Math.min(100, Math.round(newScore)));
    
    setScores(prev => prev.map(s => 
      s.dimension === dimension ? { ...s, score: clampedScore } : s
    ));

    try {
      await fetch('/api/life-scores', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimension, score: clampedScore }),
      });
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  }, []);

  const handleBarClick = useCallback((dimension: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    handleScoreChange(dimension, percentage);
  }, [handleScoreChange]);

  const handleBarDrag = useCallback((dimension: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    handleScoreChange(dimension, percentage);
  }, [isDragging, handleScoreChange]);

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className={`text-center p-4 bg-gradient-to-br ${getScoreGradient(totalScore)} rounded-xl border transition-all duration-500`}>
        <div className="text-4xl font-bold text-zinc-100 transition-all">{totalScore}</div>
        <div className="text-sm text-zinc-400">Life Score</div>
      </div>

      {/* Dimensions */}
      <div className="space-y-2">
        {scores.map((score) => (
          <div key={score.dimension} className="group">
            <div className="flex items-center gap-2 mb-1">
              <span className="transition-transform group-hover:scale-110">{score.emoji}</span>
              <span className="text-sm text-zinc-300 flex-1">{score.dimension}</span>
              <span className="text-sm font-medium text-zinc-400 tabular-nums w-8 text-right">{score.score}</span>
            </div>
            <div 
              className="h-3 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative group/bar"
              onClick={(e) => handleBarClick(score.dimension, e)}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={(e) => handleBarDrag(score.dimension, e)}
            >
              <div
                className={`h-full ${getScoreColor(score.score)} transition-all duration-200`}
                style={{ width: `${score.score}%` }}
              />
              {/* Hover indicator */}
              <div className="absolute inset-0 opacity-0 group-hover/bar:opacity-100 transition pointer-events-none">
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 transition-opacity" 
                  style={{ left: `${score.score}%`, transform: 'translateX(-50%)' }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-600">
          Game of Life — 7 Dimensions
        </p>
        <p className="text-xs text-zinc-600">
          Click bars to adjust
        </p>
      </div>
    </div>
  );
}
