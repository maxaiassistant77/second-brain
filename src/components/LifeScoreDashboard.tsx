'use client';

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

export function LifeScoreDashboard({ scores }: LifeScoreDashboardProps) {
  const totalScore = Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length);

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="text-center p-4 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl border border-violet-500/30">
        <div className="text-4xl font-bold text-zinc-100">{totalScore}</div>
        <div className="text-sm text-zinc-400">Life Score</div>
      </div>

      {/* Dimensions */}
      <div className="space-y-2">
        {scores.map((score) => (
          <div key={score.dimension} className="group">
            <div className="flex items-center gap-2 mb-1">
              <span>{score.emoji}</span>
              <span className="text-sm text-zinc-300 flex-1">{score.dimension}</span>
              <span className="text-sm font-medium text-zinc-400">{score.score}</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreColor(score.score)} transition-all duration-500`}
                style={{ width: `${score.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Game of Life — 7 Dimensions of Personal Evolution
      </p>
    </div>
  );
}
