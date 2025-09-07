'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import ProjectForm from './ProjectForm';

export default function ProjectDashboard({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleAddProject = async (newProject: Project) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
    const savedProject = await response.json();
    setProjects([...projects, savedProject]);
  };

  return (
    <div className="space-y-4">
      <ProjectForm onAddProject={handleAddProject} initialProjects={projects} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            href={`/projects/${project.id}`} 
            className="p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}