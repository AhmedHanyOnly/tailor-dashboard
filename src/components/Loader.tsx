'use client';

import { SpinLoader } from 'react-loadly';
import 'react-loadly/styles.css';

interface LoaderProps {
  text?: string;
}

export const Loader = ({ text = 'جارٍ التحميل...' }: LoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-md dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 transition-colors">
        <SpinLoader
          color="#3b82f6" // أزرق متوافق مع تصميم المشروع
          size={60}
          speed={1.2}
          loadingText=""
        />
        {/* <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium text-sm">
          {text}
        </p> */}
      </div>
    </div>
  );
};
