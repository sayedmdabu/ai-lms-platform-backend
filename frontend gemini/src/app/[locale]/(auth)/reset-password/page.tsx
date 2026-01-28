'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

// পাসওয়ার্ড ভ্যালিডেশন স্কিমা
const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const t = useTranslations('Auth'); // ট্রান্সলেশন হুক
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL থেকে টোকেন নেওয়া
  const token = searchParams.get('token');
  
  const { resetPassword, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error(t('invalidToken') || 'Invalid token');
      return;
    }

    try {
      await resetPassword(token, data.password);
      toast.success(t('resetSuccess') || 'Password reset successfully!');
      
      // সফল হলে লগইন পেজে নিয়ে যাবে
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      
    } catch (error) {
      toast.error(t('resetFailed') || 'Failed to reset password. Token may be expired.');
    }
  };

  // যদি টোকেন না থাকে
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">{t('invalidLink') || 'Invalid Link'}</h2>
          <p className="text-gray-600">{t('tokenMissingMsg') || 'The password reset link is invalid or expired.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('resetPasswordTitle') || 'Reset Password'}</h1>
          <p className="text-sm text-gray-500 mt-2">{t('resetPasswordSubtitle') || 'Enter your new password below'}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* New Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('newPassword') || 'New Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                placeholder={t('passwordPlaceholder') || 'Enter new password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{t(errors.password.message as any) || errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('confirmPassword') || 'Confirm Password'}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                placeholder={t('confirmPasswordPlaceholder') || 'Confirm new password'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{t('passwordsDoNotMatch') || "Passwords don't match"}</p>
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
                {t('resetting') || 'Resetting...'}
              </>
            ) : (
              t('resetPasswordButton') || 'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}