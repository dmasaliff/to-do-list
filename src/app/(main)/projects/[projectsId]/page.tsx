import ProjectDetailClient from '@/components/ProjectDetailClient';

async function getProjectData(projectsId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/projects/${projectsId}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data proyek');
  }

  const data = await res.json();
  return { project: data.project, tasks: data.tasks };
}

export default async function ProjectDetailPage({ params }: { params: { projectsId: string } }) {
    try {
        const { projectsId } = params;
        const { project, tasks } = await getProjectData(projectsId);

    if (!project) {
      return (
        <div className="p-8 text-center text-red-500">
          <h1 className="text-3xl font-bold">Proyek Tidak Ditemukan</h1>
          <p className="mt-2">ID proyek yang Anda cari tidak valid.</p>
        </div>
      );
    }

    return (
      <div className="bg-slate-300 p-8">
        <h1 className="text-2xl md:text-4xl w-2/3 mx-auto font-bold text-gray-900 mb-6">{project.name}</h1>
        <ProjectDetailClient initialTasks={tasks} projectId={project.id} />
      </div>
    );

  } catch (error) {
    console.error(error);
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-3xl font-bold">Gagal Memuat Proyek</h1>
        <p className="mt-2">Terjadi kesalahan saat mengambil data proyek. Silakan coba lagi nanti.</p>
      </div>
    );
  }
}