import { Outfit } from 'next/font/google';
import { Cairo } from 'next/font/google';

import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import {Toaster } from "sonner";
import I18nProvider from '@/components/I18nProvider';
import QueryProvider from '@/components/QueryProvider';
import ProtectedRoute from '@/middleware/ProtectedRoute';
const outfit = Outfit({
  subsets: ["latin"],
});
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300','400','500','600','700'], // حسب ما تحتاج
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir='rtl'>
      <body className={`${outfit.className} ${cairo.className} dark:bg-gray-900`}>
        {/* <BodyProvider> */}
        <ProtectedRoute>

        <I18nProvider>
          <QueryProvider>
          <ThemeProvider>
            <Toaster position="top-right" richColors />
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
          </QueryProvider>
        </I18nProvider>
        </ProtectedRoute>
        {/* </BodyProvider> */}
      </body>
    </html>
  );
}
