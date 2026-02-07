'use client';

interface StatCardProps {
  value: number;
  label: string;
  emoji?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export function StatCard({ value, label, emoji, trend, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center transition-all hover:border-zinc-700 hover:bg-zinc-900/50 hover:scale-[1.02] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {emoji && <span className="text-lg">{emoji}</span>}
        <span className="text-2xl font-bold text-zinc-100">{value}</span>
        {trend && (
          <span
            className={`text-xs ${
              trend === 'up'
                ? 'text-green-400'
                : trend === 'down'
                ? 'text-red-400'
                : 'text-zinc-500'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'}
          </span>
        )}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
