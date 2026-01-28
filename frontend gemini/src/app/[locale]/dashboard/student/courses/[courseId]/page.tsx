'use client';

import { useTranslations } from 'next-intl';
import { PlayCircle, Clock, BarChart, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const t = useTranslations('Courses');

  // ডামি ডেটা (পরে API থেকে আসবে)
  const course = {
    id: params.courseId,
    title: 'Complete Python Bootcamp 2024',
    description: 'Learn Python from scratch to advanced level with real-world projects.',
    instructor: 'Dr. Angela Yu',
    duration: '24h 30m',
    level: 'Beginner',
    rating: 4.8,
    totalLessons: 45,
    price: '$19.99',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', // ডামি ভিডিও
    curriculum: [
      { id: 1, title: 'Introduction to Python', duration: '15m', isFree: true },
      { id: 2, title: 'Setup Environment', duration: '20m', isFree: true },
      { id: 3, title: 'Variables and Data Types', duration: '45m', isFree: false },
      { id: 4, title: 'Control Flow', duration: '50m', isFree: false },
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        {/* Video Preview */}
        <div className="w-full md:w-1/3 aspect-video bg-black rounded-lg overflow-hidden relative group">
           <iframe 
             className="w-full h-full"
             src={course.videoUrl} 
             title="Course Preview"
             allowFullScreen
           />
        </div>

        {/* Course Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 w-fit px-3 py-1 rounded-full">
            <BarChart className="h-4 w-4" />
            {course.level}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {course.duration}
            </span>
            <span>👨‍🏫 {course.instructor}</span>
            <span className="text-yellow-500">⭐ {course.rating}</span>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Enroll Now - {course.price}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
        
        <div className="space-y-3">
          {course.curriculum.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-200">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${lesson.isFree ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                  {lesson.isFree ? <PlayCircle className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                  <p className="text-xs text-gray-500">{lesson.duration}</p>
                </div>
              </div>
              
              {lesson.isFree && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  Preview
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}