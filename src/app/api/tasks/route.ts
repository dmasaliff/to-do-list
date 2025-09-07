import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import {auth} from '@/auth';

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const body = await request.json();
    const { title, description, projectId, dueDate } = body;

    if (!title || !projectId) {
      return NextResponse.json({ message: 'Judul dan Project ID wajib diisi.' }, { status: 400 });
    }
    
    const newId = uuidv4();
    const insert = db.prepare('INSERT INTO tasks (id, title, description, completed, dueDate, projectId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insert.run(newId, title, description || null, 0, dueDate || null, projectId, userId);
    
    revalidatePath('/dashboard');
    
    const newTask = { 
      id: newId, 
      title, 
      description: description || null, 
      completed: 0, 
      dueDate: dueDate || null, 
      projectId 
    };
    
    return NextResponse.json(newTask, { status: 201 });

  } catch (error) {
    console.error('Gagal membuat tugas baru di database:', error);
    return NextResponse.json(
      { message: 'Gagal memproses permintaan.' },
      { status: 500 }
    );
  }
}