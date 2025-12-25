'use client';

import { useI18n } from '@/contexts/I18nContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LanguageToggle() {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: 'en' | 'ar') => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLocale);
    
    // Force full page reload to apply new locale from server
    window.location.href = `${pathname}?${params.toString()}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-8 px-12 py-8 rounded-8 border border-border-muted bg-accent-white hover:bg-black-alpha-4 transition-colors text-label-medium text-accent-black"
        aria-label="Switch language"
      >
        <svg
          className="w-18 h-18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="uppercase">{locale}</span>
        <svg
          className={`w-16 h-16 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-8 end-0 bg-accent-white border border-border-muted rounded-8 shadow-lg overflow-hidden z-20 min-w-150">
            <button
              onClick={() => switchLanguage('en')}
              className={`w-full px-16 py-12 text-start text-label-medium hover:bg-black-alpha-4 transition-colors flex items-center gap-12 ${
                locale === 'en' ? 'bg-black-alpha-8 text-heat-100' : 'text-accent-black'
              }`}
            >
              <span className="text-20">🇬🇧</span>
              <span>English</span>
              {locale === 'en' && (
                <svg
                  className="w-16 h-16 ms-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => switchLanguage('ar')}
              className={`w-full px-16 py-12 text-start text-label-medium hover:bg-black-alpha-4 transition-colors flex items-center gap-12 ${
                locale === 'ar' ? 'bg-black-alpha-8 text-heat-100' : 'text-accent-black'
              }`}
            >
              <span className="text-20">🇸🇦</span>
              <span>العربية</span>
              {locale === 'ar' && (
                <svg
                  className="w-16 h-16 ms-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
