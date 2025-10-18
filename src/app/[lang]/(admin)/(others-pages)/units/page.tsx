'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useUnits } from '@/hooks/useUnits';
import { LoaderPage } from '@/components/LoaderPage';
import Button from '@/components/ui/button/Button';
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { toast } from 'sonner';
import { Unit } from '@/api/methods/units';

type UnitFormValues = {
  name: string;
};

export default function UnitsPage() {
  const { unitsQuery, createMutation, updateMutation, deleteMutation } = useUnits();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUnitId, setDeleteUnitId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormValues>();

  if (unitsQuery.isLoading) return <LoaderPage />;
  if (unitsQuery.isError) return <div>حدث خطأ أثناء تحميل الوحدات</div>;

  const openAddModal = () => {
    reset({ name: '' });
    setEditingUnit(null);
    setIsOpen(true);
  };

  const openEditModal = (unit: Unit) => {
    reset({ name: unit.name });
    setEditingUnit(unit);
    setIsOpen(true);
  };
  const onSubmit = (data: UnitFormValues) => {
    if (editingUnit) {
      // 🟢 تعديل وحدة
      updateMutation.mutate(
        { id: editingUnit.id, data },
        {
          onSuccess: (response) => {

            toast.success(response?.message );
            setIsOpen(false);
          },
          onError: () => {
            toast.error('حدث خطأ أثناء تعديل الوحدة');
          },
        },
      );
    } else {
      // 🟢 إنشاء وحدة
      createMutation.mutate(data, {
        onSuccess: (response) => {
          toast.success(response?.message);
          setIsOpen(false);
        },
        onError: () => {
          toast.error('حدث خطأ أثناء إضافة الوحدة');
        },
      });
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteUnitId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteUnitId) {
      deleteMutation.mutate(deleteUnitId, {
        onSuccess: (response) => {
          console.log(response);
          toast.success(response?.message );
          setDeleteModalOpen(false);
          setDeleteUnitId(null);
        },
        onError: () => {
          toast.error('حدث خطأ أثناء حذف الوحدة');
        },
      });
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="الوحدات" />
      <div className="space-y-6">
        <ComponentCard title="الوحدات">
          <Button onClick={openAddModal} className="mb-4 flex items-center gap-2">
            <PlusIcon /> إضافة وحدة
          </Button>

          {/* إضافة / تعديل وحدة */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="m-4 max-w-[500px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                {editingUnit ? 'تعديل الوحدة' : 'إضافة وحدة جديدة'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <Input {...register('name', { required: true })} />
                  {errors.name && <p className="text-sm text-red-500">الاسم مطلوب</p>}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">{editingUnit ? 'تعديل' : 'إضافة'}</Button>
              </div>
            </form>
          </Modal>

          {/* Modal حذف */}
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            className="m-4 max-w-[400px]"
          >
            <div className="rounded-xl bg-white p-6 text-center dark:bg-gray-900">
              <p className="mb-6 text-lg text-gray-800 dark:text-white/90">
                هل أنت متأكد من حذف هذه الوحدة؟
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  حذف
                </Button>
              </div>
            </div>
          </Modal>

          {/* جدول الوحدات */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[500px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                      >
                        الاسم
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                      >
                        إجراءات
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {unitsQuery.data?.map((u: Unit) => (
                      <TableRow key={u.id}>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {u.name}
                        </TableCell>
                        <TableCell className="text-theme-sm flex justify-center gap-2 px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(u)}>
                            <PencilIcon />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openDeleteModal(u.id)}>
                            <TrashBinIcon />
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
