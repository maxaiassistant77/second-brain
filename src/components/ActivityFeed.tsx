'use client';

import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  timestamp: string;
  type: string;
  action: string;
  details?: string;
  icon: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50"
        >
          <span className="text-lg">{activity.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-300">
              <span className="font-medium">{activity.action}</span>
              {activity.details && (
                <span className="text-zinc-500"> — {activity.details}</span>
              )}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
