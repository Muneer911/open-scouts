'use client';

import { requestPasswordResetAction } from '@/app/actions/auth';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-start mb-2">
          {t('auth.forgotPassword.title')}
        </h1>
        <p className="text-start text-gray-600 mb-6">
          {t('auth.forgotPassword.subtitle')}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-start">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-start">
            <p className="font-medium mb-2">{t('auth.forgotPassword.successTitle')}</p>
            <p className="text-sm">{t('auth.forgotPassword.successMessage')}</p>
            <Link
              href="/login"
              className="inline-block mt-4 text-blue-600 hover:underline text-sm"
            >
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        ) : (
          <form
            action={async (formData) => {
              setLoading(true);
              setError(null);
              const result = await requestPasswordResetAction(formData);
              setLoading(false);

              if (result?.error) {
                setError(result.error);
              } else {
                setSuccess(true);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-start mb-2 font-medium">
                {t('auth.login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                dir="auto"
                className="w-full ps-4 pe-4 py-3 text-start rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder={t('auth.login.emailPlaceholder')}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.submit')}
            </button>

            <p className="text-center text-sm text-gray-600">
              <Link href="/login" className="text-blue-600 hover:underline">
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
