import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { revalidatePath } from 'next/cache';
import {auth} from '@/auth';

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Nama proyek tidak valid' }, { status: 400 });
    }

    // Cari ID terbesar yang sudah ada di database
    const lastIdResult = db.prepare('SELECT MAX(CAST(id AS INTEGER)) AS maxId FROM projects').get() as { maxId: number | null };
    // Tentukan ID baru
    const newId = (lastIdResult.maxId !== null ? lastIdResult.maxId + 1 : 1).toString();

    const insert = db.prepare('INSERT INTO projects (id, name, userId) VALUES (?,?,?)');
    insert.run(newId, name, userId);

    revalidatePath('/dashboard');
    return NextResponse.json({ id: newId, name, userId }, { status: 201 });
    
  } catch (error) {
    console.error('Gagal membuat proyek baru:', error);
    return NextResponse.json({ message: 'Gagal memproses permintaan' }, { status: 500 });
  }
}