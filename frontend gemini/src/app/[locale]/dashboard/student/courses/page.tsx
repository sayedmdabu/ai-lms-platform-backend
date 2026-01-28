'use client';

import { useTranslations } from 'next-intl';
import { BookOpen, Clock, Star } from 'lucide-react';

export default function MyCoursesPage() {
  const t = useTranslations('Courses');

  // ডামি কোর্স ডেটা (পরে API থেকে আসবে)
  const courses = [
    {
      id: 1,
      title: 'Complete Python Bootcamp',
      instructor: 'Dr. Angela Yu',
      progress: 45,
      thumbnail: 'bg-blue-100', // ইমেজের বদলে কালার দিচ্ছি আপাতত
      lessons: 120,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Next.js 14 Full Stack Guide',
      instructor: 'Hitesh Choudhary',
      progress: 10,
      thumbnail: 'bg-black',
      lessons: 85,
      rating: 4.9
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('enrolledCourses')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
            {/* Thumbnail */}
            <div className={`h-40 w-full ${course.thumbnail} flex items-center justify-center`}>
              <BookOpen className="h-12 w-12 text-white opacity-50" />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{course.lessons} Lessons</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 font-medium">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{course.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}