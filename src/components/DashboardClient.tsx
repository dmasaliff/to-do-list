// MENAMPILKAN UI DAN INTERAKTIVITAS DASHBOARD
'use client';

import { Session } from 'next-auth';
import { Project, Task } from '@/lib/types';
import ProjectDashboard from '@/components/ProjectDashboard';
import TaskDashboard from '@/components/TaskDashboard';

interface DashboardClientProps {
  session: Session;
  projects: Project[];
  tasks: Task[];
}

export default function DashboardClient({ session, projects, tasks }: DashboardClientProps) {
  return (
    <div className="px-8 space-y-8 bg-slate-300">
      <h5 className="text-sm md:text-lg font-medium text-emerald-500">
        Selamat Datang, {session?.user?.name}
      </h5>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Your Projects</h2>
        <ProjectDashboard initialProjects={projects} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">All Tasks</h2>
        <TaskDashboard initialTasks={tasks} />
      </div>
    </div>
  );
}