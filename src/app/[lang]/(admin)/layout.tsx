'use client';

import AuthLoader from '@/components/AuthLoader';
import { Loader } from '@/components/Loader';
import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import Backdrop from '@/layout/Backdrop';
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const {  loading } = useAuthStore();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? 'ms-0'
    : isExpanded || isHovered
      ? 'lg:ms-[290px]'
      : 'lg:ms-[90px]';
  if (loading) return <Loader />; // ← عرض اللودر لحد ما البيانات تتحمل

  return (
    <AuthLoader>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
        </div>
      </div>
    </AuthLoader>
  );
}
