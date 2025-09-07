import {auth} from '@/auth'
import { redirect } from 'next/navigation';
import db from '@/lib/database'
import AnalyticsClient from '../../../components/AnalyticsClient';

interface TasksPerProjectResult {
  name: string;
  taskCount: number;
}

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session || !session.user) {
      redirect('/login');
  }

  const userId = session.user.id;
  const totalCompleted = db.prepare('SELECT COALESCE(COUNT(*), 0) AS count FROM tasks WHERE userId = ? AND completed = 1').get(userId) as { count: number };
  const totalPending = db.prepare('SELECT COALESCE(COUNT(*), 0) AS count FROM tasks WHERE userId = ? AND completed = 0').get(userId) as {count: number};
  const tasksPerProject = db.prepare(`
    SELECT p.name, COUNT(t.id) as taskCount
    FROM projects p
    JOIN tasks t ON p.id = t.projectId
    WHERE p.userId = ?
    GROUP BY p.name
  `).all(userId) as TasksPerProjectResult[];
  const dailyCompletion = db.prepare("SELECT DATE(completionDate) AS date, COUNT(*) AS count FROM tasks WHERE userId = ? AND completionDate IS NOT NULL GROUP BY date ORDER BY date").all(userId) as { date: string, count: number }[];

  const analyticsData = {
    totalCompleted: totalCompleted.count ?? 0,
    totalPending: totalPending.count ?? 0,
    tasksPerProject: tasksPerProject,
    dailyCompletion: dailyCompletion,
  };

  return (
    <div className="p-8 bg-slate-300">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <AnalyticsClient data={analyticsData} />
    </div>
  );
}