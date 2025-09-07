import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/database';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
    return NextResponse.json({ message: 'Registrasi berhasil.', userId: info.lastInsertRowid }, { status: 201 });
    
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json({ error: 'Registrasi gagal. Silakan coba lagi.' }, { status: 500 });
  }
}