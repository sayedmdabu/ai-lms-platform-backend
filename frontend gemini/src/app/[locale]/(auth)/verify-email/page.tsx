'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  const t = useTranslations('Auth');
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuthStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      console.log('🚀 [Page] Verification started');
      console.log('📝 [Page] Token:', token?.substring(0, 30) + '...');
      
      // Check if token exists
      if (!token) {
        console.error('❌ [Page] No token in URL');
        setStatus('error');
        setErrorMessage('No verification token provided in URL');
        return;
      }

      try {
        console.log('⏳ [Page] Calling verifyEmail from store...');
        
        // Call verification
        await verifyEmail(token);
        
        console.log('✅ [Page] Verification completed successfully!');
        setStatus('success');
      } catch (error: any) {
        console.error('❌ [Page] Verification error caught:', error);
        
        const message = error.response?.data?.detail 
          || error.response?.data?.message 
          || error.message 
          || 'The token may be invalid or expired';
        
        setStatus('error');
        setErrorMessage(message);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 space-y-6">
        
        {/* Loading State */}
        {status === 'loading' && (
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('verifying') || 'Verifying your email...'}
            </h1>
            <p className="text-sm text-gray-500">
              Please wait while we verify your email address
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('emailVerified') || 'Email Verified!'}
              </h1>
              <p className="text-gray-600 mt-2">
                {t('verificationSuccess') || 'Your email has been successfully verified.'}
              </p>
            </div>
            
            <Link 
              href="/login" 
              className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {t('goToLogin') || 'Go to Login'}
            </Link>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('verificationFailed') || 'Verification Failed'}
              </h1>
              <p className="text-gray-600 mt-2">
                {errorMessage || t('verificationError') || 'The token may be invalid or expired.'}
              </p>
            </div>

            {/* Show debug info in development */}
            {process.env.NODE_ENV === 'development' && errorMessage && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      Error Details:
                    </p>
                    <p className="text-xs text-red-700 break-words">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                {t('backToLogin') || 'Back to Login'}
              </Link>
              
              <p className="text-xs text-gray-500 pt-2">
                If you need a new verification link, please contact support or register again.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-md w-full">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            🛠️ Debug Info (Development Only):
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Token Present:</strong> {token ? 'Yes' : 'No'}</p>
            {token && (
              <p className="break-all">
                <strong>Token:</strong> {token.substring(0, 50)}...
              </p>
            )}
            <p><strong>Status:</strong> {status}</p>
            {errorMessage && (
              <p><strong>Error:</strong> {errorMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}