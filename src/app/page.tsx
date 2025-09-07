import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-300">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Welcome to Your To-Do List</h1>
      <p className="mt-4 text-sm lg:text-lg text-gray-600">Organize your life, one task at a time.</p>
      <div className="mt-8">
        <Link href="/login" className="text-sm lg:text-xl px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Get Started
        </Link>
      </div>
    </div>
  );
}