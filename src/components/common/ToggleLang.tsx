'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FiFlag } from "react-icons/fi";

export const ToggleLang = () => {
  const router = useRouter();
  const pathname = usePathname();

  // نفصل اللغة الحالية من الـ pathname
  const currentLang = pathname.split('/')[1]; // 'en' أو 'ar'

  // اللغة اللي هنحول لها
  const nextLang = currentLang === 'en' ? 'ar' : 'en';

  const toggleLanguage = () => {
    const newPath = pathname.replace(`/${currentLang}`, `/${nextLang}`);
    router.push(newPath);
  };

  return (
     <button
      onClick={toggleLanguage}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
        <FiFlag className={currentLang === "en" ? "text-blue-600" : "text-green-600"} />

      <span className="text-sm font-medium uppercase">
        {currentLang === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
};
