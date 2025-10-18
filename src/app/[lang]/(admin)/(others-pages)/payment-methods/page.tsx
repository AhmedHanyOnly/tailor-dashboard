'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { LoaderPage } from '@/components/LoaderPage';
import Button from '@/components/ui/button/Button';
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { toast } from 'sonner';
import { PaymentMethod } from '@/api/methods/paymentMethods';

type PaymentMethodFormValues = {
  name: string;
  type: string;
  is_active?: boolean;
  is_default?: boolean;
  is_cash?: boolean;
};

export default function PaymentMethodsPage() {
  const { paymentMethodsQuery, createMutation, updateMutation, deleteMutation } = usePaymentMethods();
  const [isOpen, setIsOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMethodId, setDeleteMethodId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentMethodFormValues>();

  if (paymentMethodsQuery.isLoading) return <LoaderPage />;
  if (paymentMethodsQuery.isError) return <div>حدث خطأ أثناء تحميل طرق الدفع</div>;

  const openAddModal = () => {
    reset({ name: '', type: '', is_active: true, is_default: false, is_cash: false });
    setEditingMethod(null);
    setIsOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    reset({
      name: method.name,
      type: method.type,
      is_active: method.is_active,
      is_default: method.is_default,
      is_cash: method.is_cash,
    });
    setEditingMethod(method);
    setIsOpen(true);
  };

  const onSubmit = (data: PaymentMethodFormValues) => {
    if (editingMethod) {
      updateMutation.mutate(
        { id: editingMethod.id, data },
        {
          onSuccess: () => {
            toast.success('تم تعديل طريقة الدفع بنجاح');
            setIsOpen(false);
            reset();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('تم إضافة طريقة دفع جديدة بنجاح');
          setIsOpen(false);
          reset();
        },
      });
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteMethodId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteMethodId) {
      deleteMutation.mutate(deleteMethodId, {
        onSuccess: () => {
          toast.success('تم حذف طريقة الدفع بنجاح');
          setDeleteModalOpen(false);
          setDeleteMethodId(null);
        },
      });
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="طرق الدفع" />
      <div className="space-y-6">
        <ComponentCard title="طرق الدفع">
          <Button onClick={openAddModal} className="mb-4 flex items-center gap-2">
            <PlusIcon /> إضافة طريقة دفع
          </Button>

          {/* إضافة / تعديل طريقة دفع */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="m-4 max-w-[700px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                {editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <Input {...register('name', { required: true })} />
                  {errors.name && <p className="text-red-500 text-sm">الاسم مطلوب</p>}
                </div>
                <div>
                  <Label>النوع</Label>
                  <Input {...register('type', { required: true })} />
                  {errors.type && <p className="text-red-500 text-sm">النوع مطلوب</p>}
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...register('is_active')} /> مفعل
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...register('is_default')} /> افتراضي
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...register('is_cash')} /> نقدي
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
                <Button type="submit">{editingMethod ? 'تعديل' : 'إضافة'}</Button>
              </div>
            </form>
          </Modal>

          {/* Modal حذف */}
          <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="m-4 max-w-[400px]">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl text-center">
              <p className="mb-6 text-gray-800 dark:text-white/90 text-lg">هل أنت متأكد من حذف طريقة الدفع هذه؟</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>إلغاء</Button>
                <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
              </div>
            </div>
          </Modal>

          {/* جدول طرق الدفع */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الاسم</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">النوع</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">مفعل</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">افتراضي</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">نقدي</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">إجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paymentMethodsQuery.data?.map((p: PaymentMethod) => (
                      <TableRow key={p.id}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.type}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.is_active ? 'نعم' : 'لا'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.is_default ? 'نعم' : 'لا'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.is_cash ? 'نعم' : 'لا'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(p)}>
                            <PencilIcon />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openDeleteModal(p.id)}>
                            <TrashBinIcon/>
                          </Button>
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
