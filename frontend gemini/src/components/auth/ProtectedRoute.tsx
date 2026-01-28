'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // ১. যদি হাইড্রেটেড (লোড) হয় এবং টোকেন না থাকে -> লগইন পেজে যাও
    if (_hasHydrated && !token) {
      router.push('/login');
    }
  }, [_hasHydrated, token, router]);

  // ২. যতক্ষণ লোড হচ্ছে, ততক্ষণ লোডার দেখাও
  if (!_hasHydrated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ৩. লোড শেষ কিন্তু টোকেন নেই (useEffect রিডাইরেক্ট করার আগের মুহূর্ত) -> নাল রিটার্ন করো
  if (!token) return null;

  // ৪. সব ঠিক থাকলে পেজ দেখাও
  return <>{children}</>;
}