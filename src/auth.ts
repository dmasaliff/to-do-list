// FILE INI DIGUNAKAN UNTUK MENDAPATKAN SESI DATA PENGGUNA YANG SEDANG LOGIN
import { getServerSession } from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route';

export async function auth() {
  const session = await getServerSession(authOptions); 
  return session;
}