'use client';

import { resetPasswordAction } from '@/app/actions/auth';
import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-start mb-2">
          {t('auth.resetPassword.title')}
        </h1>
        <p className="text-start text-gray-600 mb-6">
          {t('auth.resetPassword.subtitle')}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-start">
            {error}
          </div>
        )}

        <form
          action={async (formData) => {
            setLoading(true);
            setError(null);
            const result = await resetPasswordAction(formData);
            setLoading(false);

            if (result?.error) {
              setError(result.error);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="password" className="block text-start mb-2 font-medium">
              {t('auth.resetPassword.newPassword')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              dir="auto"
              className="w-full ps-4 pe-4 py-3 text-start rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder={t('auth.resetPassword.passwordPlaceholder')}
              required
              minLength={8}
            />
            <p className="text-sm text-gray-500 mt-1 text-start">
              {t('auth.resetPassword.passwordHint')}
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-start mb-2 font-medium">
              {t('auth.resetPassword.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              dir="auto"
              className="w-full ps-4 pe-4 py-3 text-start rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.resetPassword.updating') : t('auth.resetPassword.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
