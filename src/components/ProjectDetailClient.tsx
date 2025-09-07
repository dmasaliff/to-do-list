'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/lib/types';

interface ProjectDetailClientProps {
  initialTasks: Task[];
  projectId: string;
}

export default function ProjectDetailClient({ initialTasks, projectId }: ProjectDetailClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;
    try {
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          dueDate: newTaskDueDate || null,
          projectId: projectId,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menambahkan tugas melalui API');
      }

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskDescription('');

      router.refresh();

    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      alert('Gagal menambahkan tugas. Silakan coba lagi.');
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getTaskStatus = (task: Task) => {
    if (task.completed) return { text: 'Selesai', color: 'bg-green-500' };
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      return { text: 'Lewat Tenggat Waktu', color: 'bg-red-500' };
    }
    return { text: 'Belum Selesai', color: 'bg-yellow-500' };
  };

  return (
    <div className="space-y-8">
      <div className="bg-white w-2/3 mx-auto p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Tambah Tugas Baru</h3>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul</label>
            <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenggat Waktu</label>
            <input type="date" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Tambah Tugas</button>
        </form>
      </div>

      <div className="flex flex-col w-2/3 mx-auto md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded-md">
            <option value="all">Semua</option>
            <option value="completed">Selesai</option>
            <option value="pending">Belum Selesai</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sortir:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 border rounded-md">
            <option value="dueDate">Tenggat Waktu</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 w-2/3 mx-auto">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <div key={task.id} className="p-5 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</span>
                  {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                </div>
                <div className='block md:flex items-center gap-3'>
                <span className={`px-3 py-1 my-2 ml-10 text-xs font-semibold rounded-full text-white ${getTaskStatus(task).color}`}>
                  {getTaskStatus(task).text}
                </span>
                <button
                  onClick={() => handleToggleCompleted(task.id, !task.completed)}
                  className="px-4 py-2 my-2 ml-10 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {task.completed ? 'Batalkan' : 'Selesaikan'}
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 my-2 ml-10 text-xs font-semibold rounded-full text-white bg-red-500 hover:bg-red-600"
                >
                Hapus
                </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Tenggat Waktu: {task.dueDate ? task.dueDate : 'Tidak ada'}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada tugas dalam proyek ini.</p>
        )}
      </div>
    </div>
  );
}