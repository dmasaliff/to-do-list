'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface NavbarProps {
  session: Session | null;
}

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Analytics', href: '/analytics' },
];

export default function Navbar({session}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-slate-500 shadow-md py-2 px-8">
      <div className="container mx-auto flex justify-between items-center ">
        <Link href="/dashboard" className="px-2 text-lg md:text-2xl font-bold text-white hover:text-slate-300">
          To-Do App
        </Link>
        <div className="md:hidden">
            <button
              onClick={handleToggle}
              type="button"
              className="text-white hover:text-slate-300 focus:outline-none focus:text-slate-300"
            >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            </button>
          </div>
        
        <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:mx-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`my-1 text-white text-sm md:text-lg hover:text-slate-300 font-medium md:mx-4 md:my-0 ${
                  pathname === link.href ? 'text-red-500' : ''
                }`}
                onClick={handleToggle}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm md:text-lg text-white font-medium">{session.user?.name}</span>
                <button 
                  onClick={() => signOut()}
                  className="text-sm lg:text-lg px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm lg:text-lg px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}