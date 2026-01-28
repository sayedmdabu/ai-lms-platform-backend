'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);
  const t = useTranslations('Dashboard');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcome')}, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {t('noCourses')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enrolled Courses Card */}
        <div className="bg-blue-500 p-6 rounded-xl text-white shadow-lg transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">{t('enrolledCourses')}</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        
        {/* Completed Lessons Card */}
        <div className="bg-emerald-500 p-6 rounded-xl text-white shadow-lg transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">{t('completedLessons')}</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        {/* Certificates Earned Card */}
        <div className="bg-purple-500 p-6 rounded-xl text-white shadow-lg transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">{t('certificatesEarned')}</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('recentActivity')}</h2>
        
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <p className="text-gray-500 mb-6">{t('noActivity')}</p>
          
          {/* Browse Courses Button (Linked) */}
          <Link href="/dashboard/student/courses">
            <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition shadow-md">
              {t('browseCourses')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}