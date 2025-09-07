import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: Request, { params }: { params: { projectsId: string } }) {
  try {
    const { projectsId } = await params;
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectsId);
    
    if (!project) {
      return NextResponse.json({ message: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    // Ambil semua tugas dari tabel 'tasks' yang terhubung dengan proyek ini
    const projectTasks = db.prepare('SELECT * FROM tasks WHERE projectId = ?').all(projectsId);

    const data = {
      project,
      tasks: projectTasks,
    };
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('Gagal mengambil data proyek dari SQLite:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data proyek dari database.' },
      { status: 500 }
    );
  }
}