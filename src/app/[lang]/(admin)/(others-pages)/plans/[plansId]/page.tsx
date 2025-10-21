'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { usePlans } from '@/hooks/usePlans';
import { LoaderPage } from '@/components/LoaderPage';
import Button from '@/components/ui/button/Button';
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Switch from '@/components/form/switch/Switch';
import { toast } from 'sonner';

type PlanFormValues = {
  name: string;
  description?: string;
  is_active: boolean;
  price_type: 'fixed' | 'percentage_on_order';
  value: number;
  duration_in_days: number;
};

export default function PlansPage() {
  const { plansQuery, createMutation, updateMutation } = usePlans();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<(PlanFormValues & { id?: number }) | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PlanFormValues>();

  if (plansQuery.isLoading) return <LoaderPage />;
  if (plansQuery.isError) return <div>حدث خطأ أثناء تحميل الخطط</div>;

  const openAddModal = () => {
    reset({
      name: '',
      description: '',
      is_active: true,
      price_type: 'fixed',
      value: 0,
      duration_in_days: 30,
    });
    setEditingPlan(null);
    setIsOpen(true);
  };

  const openEditModal = (plan: any) => {
    reset({
      name: plan.name,
      description: plan.description,
      is_active: plan.is_active,
      price_type: plan.price_type,
      value: plan.value,
      duration_in_days: plan.duration_in_days,
    });
    setEditingPlan(plan);
    setIsOpen(true);
  };

  const onSubmit = (data: PlanFormValues) => {
    if (editingPlan?.id) {
      updateMutation.mutate({ id: editingPlan.id, data });
      toast.success('تم تعديل الخطة بنجاح');
    } else {
      createMutation.mutate(data);
      toast.success('تم إضافة الخطة بنجاح');
    }
    setIsOpen(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="الخطط" />
      <div className="space-y-6">
        <ComponentCard title="الخطط">
          <Button onClick={openAddModal} className="mb-4 flex items-center gap-2">
            <PlusIcon /> إضافة خطة
          </Button>

          {/* إضافة / تعديل خطة */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="m-4 max-w-[700px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                {editingPlan ? 'تعديل الخطة' : 'إضافة خطة جديدة'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>اسم الخطة</Label>
                  <Input {...register('name', { required: true })} />
                  {errors.name && <p className="text-sm text-red-500">الاسم مطلوب</p>}
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Input {...register('description')} />
                </div>
                <div>
                  <Label>نوع السعر</Label>
                  <Controller
                    name="price_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={
                          field.value === 'fixed'
                            ? { value: 'fixed', label: 'ثابت' }
                            : { value: 'percentage_on_order', label: 'نسبة من الطلب' }
                        }
                        options={[
                          { value: 'fixed', label: 'ثابت' },
                          { value: 'percentage_on_order', label: 'نسبة من الطلب' },
                        ]}
                        onChange={(val: any) => field.onChange(val.value)}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>القيمة</Label>
                  <Input type="number" {...register('value', { valueAsNumber: true })} />
                </div>
                <div>
                  <Label>مدة الخطة بالأيام</Label>
                  <Input type="number" {...register('duration_in_days', { valueAsNumber: true })} />
                </div>
                <div>
                  <Label>نشطة</Label>
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch defaultChecked={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">{editingPlan ? 'تعديل' : 'إضافة'}</Button>
              </div>
            </form>
          </Modal>

          {/* جدول الخطط */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>اسم الخطة</TableCell>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>الوصف</TableCell>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>نوع السعر</TableCell>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>القيمة</TableCell>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>مدة الأيام</TableCell>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>نشطة</TableCell>
                      <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>إجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {plansQuery.data?.data.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className='px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400'>{p.name}</TableCell>
                        <TableCell className='px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400'>{p.description}</TableCell>
                        <TableCell className='px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400'>{p.price_type === 'fixed' ? 'ثابت' : 'نسبة من الطلب'}</TableCell>
                        <TableCell className='px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400'>{p.value}</TableCell>
                        <TableCell className='px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400'>{p.duration_in_days}</TableCell>
                        <TableCell className='px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400'>{p.is_active ? 'نعم' : 'لا'}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(p)}>
                            <PencilIcon />
                          </Button>
                          {/* زر حذف ممكن تضيفه لو عندك deleteMutation */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
