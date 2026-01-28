import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        🎓 AI-Powered LMS
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        System is running successfully!
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/dashboard/student" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}