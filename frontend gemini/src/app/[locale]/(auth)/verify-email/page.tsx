'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  // 1. Localization hook
  const t = useTranslations('Auth');
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuthStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verify = async () => {
      // If no token is found in URL, show error
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        // Call the verify action from store
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-auto mt-10">
      
      {/* Loading State */}
      {status === 'loading' && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('verifying') || 'Verifying your email...'}
          </h1>
        </>
      )}

      {/* Success State */}
      {status === 'success' && (
        <>
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('emailVerified') || 'Email Verified!'}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('verificationSuccess') || 'Your email has been successfully verified.'}
            </p>
          </div>
          
          {/* Custom Styled Link Button */}
          <Link 
            href="/dashboard/student" 
            className="mt-4 inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            {t('goToDashboard') || 'Go to Dashboard'}
          </Link>
        </>
      )}

      {/* Error State */}
      {status === 'error' && (
        <>
          <XCircle className="h-16 w-16 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('verificationFailed') || 'Verification Failed'}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('verificationError') || 'The token may be invalid or expired.'}
            </p>
          </div>

          {/* Custom Styled Outline Link Button */}
          <Link 
            href="/login" 
            className="mt-4 inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            {t('backToLogin') || 'Back to Login'}
          </Link>
        </>
      )}
    </div>
  );
}