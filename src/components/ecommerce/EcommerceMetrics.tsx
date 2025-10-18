'use client';
import React from 'react';
import Badge from '../ui/badge/Badge';
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from '@/icons';

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- إجمالي الشركات / المحلات --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              إجمالي الشركات / المحلات
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">128</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            5.6%
          </Badge>
        </div>
      </div>

      {/* <!-- إجمالي العملاء --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">إجمالي العملاء</span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">3,782</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* <!-- إجمالي الطلبات المنفذة / قيد التنفيذ --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              إجمالي الطلبات المنفذة / قيد التنفيذ
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">5,359</h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>

      {/* <!-- الأرباح الشهرية / السنوية --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              الأرباح الشهرية / السنوية
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              42,850 ر.س
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            7.8%
          </Badge>
        </div>
      </div>

      {/* <!-- عدد الاشتراكات النشطة والمنتهية --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              عدد الاشتراكات النشطة والمنتهية
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              640 / 89
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            12.3%
          </Badge>
        </div>
      </div>
    </div>
  );
};
