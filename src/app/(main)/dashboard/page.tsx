import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {getAll} from '@/lib/database';
import { Project, Task } from '@/lib/types';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  let projects: Project[] = [];
  let tasks: Task[] = [];
  
  try {
    const userId = session.user.id;
    projects = getAll<Project>('SELECT * FROM projects WHERE userId = ?', [userId]);
    tasks = getAll<Task>('SELECT * FROM tasks WHERE userId = ?', [userId]);
  } catch (error) {
    console.error(error);
    return <p className="text-center text-red-500">Gagal memuat data dashboard.</p>;
  }

  return (
    <div className="p-8 space-y-8 bg-slate-300">
      <DashboardClient session={session} projects={projects} tasks={tasks}/>
    </div>
  );
}