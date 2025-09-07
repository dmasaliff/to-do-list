'use client';

import { useState } from 'react';
import { Project } from '@/lib/types';

interface ProjectFormProps {
  onAddProject: (newProject: Project) => void;
  initialProjects: Project[];
}

export default function ProjectForm({ onAddProject, initialProjects }: ProjectFormProps) {
  const [newProjectName, setNewProjectName] = useState('');
  
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() === '') return;

    const newProjectId = (initialProjects.length > 0) 
      ? (parseInt(initialProjects[initialProjects.length - 1].id) + 1).toString() 
      : '1';
    
    const newProject: Project = {
      id: newProjectId,
      name: newProjectName,
    };

    onAddProject(newProject);
    setNewProjectName('');
  };

  return (
    <form onSubmit={handleAddProject} className="flex gap-2">
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        placeholder="Nama proyek baru..."
        required
        className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="text-sm md:text-lg px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
      >
        Buat Proyek
      </button>
    </form>
  );
}