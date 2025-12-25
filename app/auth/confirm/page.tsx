'use client';

import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';

export default function ConfirmEmailPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">{t('auth.confirm.title')}</h1>
        <p className="text-gray-600 mb-6">{t('auth.confirm.message')}</p>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 text-start">
          <p className="text-sm">{t('auth.confirm.instructions')}</p>
        </div>

        <Link
          href="/login"
          className="inline-block text-blue-600 hover:underline text-sm"
        >
          {t('auth.confirm.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
