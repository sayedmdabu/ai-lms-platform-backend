'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

// Define validation schema using Zod
const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  // Hook for translations (accessing 'Auth' namespace)
  const t = useTranslations('Auth');
  
  const { forgotPassword, isLoading } = useAuthStore();
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data.email);
      setIsSent(true);
      toast.success(t('resetLinkSent') || 'Reset link sent to your email!');
    } catch (error) {
      toast.error(t('genericError') || 'Something went wrong. Please try again.');
    }
  };

  // View: Success Message (Email Sent)
  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('checkEmail') || 'Check your email'}</h2>
            <p className="text-gray-500 mt-2">
              {t('resetLinkSentMsg') || 'We have sent a password reset link to your email address.'}
            </p>
          </div>

          <Link 
            href="/login" 
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {t('backToLogin') || 'Back to Login'}
          </Link>
        </div>
      </div>
    );
  }

  // View: Forgot Password Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('forgotPasswordTitle') || 'Forgot Password'}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {t('forgotPasswordSubtitle') || 'Enter your email to reset your password'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Input Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email') || 'Email Address'}
            </label>
            <input
              type="email"
              {...register('email')} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder={t('emailPlaceholder') || 'name@example.com'}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {t('invalidEmail') || "Invalid email address"}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                {t('sending') || 'Sending...'}
              </>
            ) : (
              t('sendResetLink') || 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToLogin') || 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}