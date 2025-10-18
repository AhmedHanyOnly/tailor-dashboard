import Image from 'next/image';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        <div className="fixed start-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>{' '}
        {children}
        <div className="relative hidden h-full w-full items-center lg:grid lg:w-1/2">
          <Image src={'/bg-login.jpg'} alt="Background" fill className="object-cover" priority />

          <div className="absolute inset-0 bg-blue-500/30"></div>

          <div className="relative z-10 mx-auto flex max-w-xs flex-col items-center">
            <h3 className="text-[80px] font-extrabold tracking-wider text-white drop-shadow-lg sm:text-[100px] md:text-[50px]">
              لوحة التحكم
            </h3>
            <p className="mt-2 text-lg font-medium text-white/80 sm:text-xl">نظام إدارة الخياطة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
