'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  // Localization hook
  const t = useTranslations('Auth');
  const router = useRouter();
  
  // Zustand store for auth management
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // FastAPI OAuth2PasswordRequestForm expects form-data, not JSON
      const formData = new FormData();
      formData.append('username', data.email); // OAuth2 standard uses 'username' field
      formData.append('password', data.password);

      // Call the backend login API
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Store token in Zustand store and LocalStorage
      login(response.data.access_token);
      
      toast.success(t('loginSuccess') || 'Logged in successfully');
      
      // Redirect to student dashboard after a short delay
      setTimeout(() => router.push('/dashboard/student'), 1000);

    } catch (error: any) {
      console.error(error);
      // Display error message from backend or fallback to default
      toast.error(error.response?.data?.detail || t('loginFailed') || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('welcomeBack') || 'Welcome Back'}</h1>
          <p className="text-gray-500 mt-2">{t('loginSubtitle') || 'Please sign in to continue'}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email') || 'Email Address'}
            </label>
            <input
              type="email"
              {...register('email', { required: t('emailRequired') || 'Email is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={t('emailPlaceholder') || 'name@example.com'}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('password') || 'Password'}
            </label>
            <input
              type="password"
              {...register('password', { required: t('passwordRequired') || 'Password is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={t('passwordPlaceholder') || 'Enter your password'}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          {/* Forgot Password Link (Added) */}
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline font-medium"
            >
              {t('forgotPassword') || 'Forgot Password?'}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (t('signIn') || 'Sign In')}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm text-gray-600">
          {t('dontHaveAccount') || "Don't have an account?"}{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            {t('registerHere') || 'Register here'}
          </Link>
        </div>
      </div>
    </div>
  );
}