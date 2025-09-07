import Navbar from '@/components/Navbar';
import React from 'react';
import {auth} from '@/auth'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div>
      <Navbar session={session}/>
      <main>
        {children}
      </main>
    </div>
  );
}