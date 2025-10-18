'use client';

import { ProgressRingLoader } from 'react-loadly';
import 'react-loadly/styles.css';

export const LoaderPage = () => {
  return (
      <div className="flex flex-col items-center justify-center bg-transparent h-full  p-6 text-gray-500  transition-colors  ">
        <ProgressRingLoader
          color="#3b82f6"
          size={50}
          speed={0.6}
          loadingText="...جاري تحميل الصفحه"
          progress={50}
          thickness={8}
        />
      </div>
  );
};
