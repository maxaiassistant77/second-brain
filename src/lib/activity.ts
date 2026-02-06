import fs from 'fs';
import path from 'path';

export interface ActivityItem {
  id: string;
  timestamp: Date;
  type: 'session' | 'document' | 'tool' | 'cron' | 'message';
  action: string;
  details?: string;
  icon: string;
}

// Read from OpenClaw logs/session data to show agent activity
export function getRecentActivity(): ActivityItem[] {
  const activities: ActivityItem[] = [];
  
  // Check workspace memory files for recent updates
  const memoryDir = '/Users/maxbot/.openclaw/workspace/memory';
  const secondBrainDir = '/Users/maxbot/.openclaw/workspace/second-brain';
  
  // Get recently modified files as activity
  const scanDir = (dir: string, type: 'document' | 'session') => {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fullPath = path.join(dir, entry.name);
        const stats = fs.statSync(fullPath);
        const hourAgo = Date.now() - (24 * 60 * 60 * 1000); // Last 24h
        
        if (stats.mtimeMs > hourAgo) {
          activities.push({
            id: `${type}-${entry.name}-${stats.mtimeMs}`,
            timestamp: stats.mtime,
            type: 'document',
            action: stats.ctimeMs === stats.mtimeMs ? 'Created' : 'Updated',
            details: entry.name.replace('.md', ''),
            icon: '📝',
          });
        }
      } else if (entry.isDirectory()) {
        scanDir(path.join(dir, entry.name), type);
      }
    }
  };
  
  scanDir(memoryDir, 'document');
  scanDir(secondBrainDir, 'document');
  
  // Sort by timestamp descending
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 20);
}
