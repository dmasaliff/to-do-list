import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { revalidatePath } from 'next/cache';
import {auth} from '@/auth'

export async function PATCH(request: Request, { params }: { params: { taskId: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { taskId } = params;
    const { completed } = await request.json();

    if (completed === undefined) {
      return NextResponse.json({ message: 'Status completed tidak valid.' }, { status: 400 });
    }

    // 💡 Periksa apakah tugas adalah milik pengguna yang sedang login
    const getTask = db.prepare('SELECT projectId, userId FROM tasks WHERE id = ?');
    const task = getTask.get(taskId) as { projectId: string; userId: string } | undefined;

    if (!task) {
      return NextResponse.json({ message: 'Tugas tidak ditemukan.' }, { status: 404 });
    }
    
    if (task.userId !== session.user.id) {
      return NextResponse.json({ message: 'Tidak diotorisasi untuk mengubah tugas ini.' }, { status: 403 });
    }

    const update = db.prepare('UPDATE tasks SET completed = ?, completionDate = ? WHERE id = ?');
    const completionDate = completed ? new Date().toISOString() : null;
    const result = update.run(completed ? 1 : 0, completionDate, taskId);

    if (result.changes === 0) {
      console.log(`Peringatan: Tugas dengan ID ${taskId} tidak diubah.`);
      return NextResponse.json({ message: 'Tugas gagal diperbarui.' }, { status: 500 });
    }

    revalidatePath('/dashboard');
    revalidatePath(`/projects/${task.projectId}`);
    return NextResponse.json({ message: 'Status tugas berhasil diperbarui.' });
  } catch (error) {
    console.error('Gagal memperbarui status tugas:', error);
    return NextResponse.json({ message: 'Gagal memproses permintaan.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { taskId: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { taskId } = params;
    const getTask = db.prepare('SELECT projectId, userId FROM tasks WHERE id = ?');
    const task = getTask.get(taskId) as { projectId: string; userId: string } | undefined;

    if (!task) {
      return NextResponse.json({ message: 'Tugas tidak ditemukan.' }, { status: 404 });
    }

    // Pastikan tugas milik pengguna yang sedang login
    if (task.userId !== session.user.id) {
      return NextResponse.json({ message: 'Tidak diotorisasi untuk menghapus tugas ini.' }, { status: 403 });
    }

    const deleteStatement = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStatement.run(taskId);

    if (result.changes === 0) {
      return NextResponse.json({ message: 'Tugas gagal dihapus.' }, { status: 500 });
    }

    revalidatePath('/dashboard');
    
    if (task.projectId) {
      revalidatePath(`/projects/${task.projectId}`);
    }

    return NextResponse.json({ message: 'Tugas berhasil dihapus.' });
  } catch (error) {
    console.error('Gagal menghapus tugas:', error);
    return NextResponse.json({ message: 'Gagal memproses permintaan.' }, { status: 500 });
  }
}