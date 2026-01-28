'use client';

import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Bell } from 'lucide-react';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const t = useTranslations('Header'); // 'Header' সেকশন থেকে টেক্সট আনছি
  const router = useRouter();
  const pathname = usePathname();

  // বর্তমান ভাষা বের করা (URL-এর প্রথম অংশ থেকে, যেমন /en/...)
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleLanguageChange = (newLocale: string) => {
    // বর্তমান URL থেকে ভাষা পরিবর্তন করে নতুন পেজে পাঠানো
    // উদাহরণ: /en/dashboard -> /bn/dashboard
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale || '/dashboard/student'}`; // পাথমে কিছু না থাকলে ড্যাশবোর্ডে পাঠাবে
    router.push(newPath);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* টাইটেল এখন json ফাইল থেকে আসবে */}
      <h2 className="text-xl font-semibold text-gray-800">{t('title')}</h2>
      
      <div className="flex items-center gap-6">
        
        {/* Language Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
          <Globe className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
          <select 
            className="bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
            value={currentLocale}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Student'}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            {user?.email?.[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}