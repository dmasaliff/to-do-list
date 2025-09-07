'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';

export default function TaskDashboard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const handleToggleCompleted = async (taskId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isCompleted }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui status tugas.');
      }

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: isCompleted } : task
      ));

    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      alert('Gagal memperbarui status tugas.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
  if (!window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Gagal menghapus tugas.');
    }

    // Perbarui state lokal untuk segera menampilkan perubahan
    setTasks(tasks.filter(task => task.id !== taskId));

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    alert('Gagal menghapus tugas.');
  }
};

  const getTaskStatus = (task: Task) => {
    if (task.completed) {
      return { text: 'Selesai', color: 'bg-green-500' };
    }
    const today = new Date().toISOString().slice(0, 10);
    if (task.dueDate && task.dueDate < today) {
      return { text: 'Lewat Tenggat Waktu', color: 'bg-red-500' };
    }
    return { text: 'Belum Selesai', color: 'bg-yellow-500' };
  };

  return (
    <div>
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task.id}
              className="p-5 bg-gray-50 rounded-md shadow-sm flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </span>
                <span className="text-sm text-gray-500">
                  {task.dueDate ? `Tenggat: ${task.dueDate}` : 'Tanpa Tenggat'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getTaskStatus(task).color}`}
                >
                  {getTaskStatus(task).text}
                </span>
                <button
                  onClick={() => handleToggleCompleted(task.id, !task.completed)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {task.completed ? 'Batalkan' : 'Selesaikan'}
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-red-500 hover:bg-red-600"
                >
                Hapus
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Belum ada tugas.</p>
        )}
      </ul>
    </div>
  );
}