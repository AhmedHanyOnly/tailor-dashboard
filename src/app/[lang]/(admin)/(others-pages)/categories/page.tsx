'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useCategories } from '@/hooks/useCategories';
import { LoaderPage } from '@/components/LoaderPage';
import Button from '@/components/ui/button/Button';
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { toast } from 'sonner';
import { Category } from '@/api/methods/categories';

type CategoryFormValues = {
  name: string;
  parentId?: number;
};

export default function CategoriesPage() {
  const { categoriesQuery, createMutation, updateMutation, deleteMutation } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>();

  if (categoriesQuery.isLoading) return <LoaderPage />;
  if (categoriesQuery.isError) return <div>حدث خطأ أثناء تحميل التصنيفات</div>;

  const openAddModal = () => {
    reset({ name: '', parentId: undefined });
    setEditingCategory(null);
    setIsOpen(true);
  };

  const openEditModal = (category: Category) => {
    reset({
      name: category.name,
      parentId: category.parent?.id,
    });
    setEditingCategory(category);
    setIsOpen(true);
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
      toast.success('تم تعديل التصنيف بنجاح');
    } else {
      createMutation.mutate(data);
      toast.success('تم إضافة التصنيف بنجاح');
    }
    setIsOpen(false);
  };

  const openDeleteModal = (id: number) => {
    setDeleteCategoryId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCategoryId !== null) {
      deleteMutation.mutate(deleteCategoryId, {
        onSuccess: () => toast.success('تم حذف التصنيف بنجاح')
      });
    }
    setDeleteModalOpen(false);
    setDeleteCategoryId(null);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="التصنيفات" />
      <div className="space-y-6">
        <ComponentCard title="التصنيفات">
          <Button onClick={openAddModal} className="mb-4 flex items-center gap-2">
            <PlusIcon /> إضافة تصنيف
          </Button>

          {/* إضافة / تعديل تصنيف */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="m-4 max-w-[700px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <Input {...register('name', { required: true })} />
                  {errors.name && <p className="text-red-500 text-sm">الاسم مطلوب</p>}
                </div>
                <div>
                  <Label>التصنيف الأب (اختياري)</Label>
                  <select {...register('parentId')} className="w-full border rounded px-3 py-2">
                    <option value="">بدون تصنيف أب</option>
                    {categoriesQuery.data
                      ?.filter(c => !editingCategory || c.id !== editingCategory.id)
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
                <Button type="submit">{editingCategory ? 'تعديل' : 'إضافة'}</Button>
              </div>
            </form>
          </Modal>

          {/* Modal حذف */}
          <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="m-4 max-w-[400px]">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl text-center">
              <p className="mb-6 text-gray-800 dark:text-white/90 text-lg">هل أنت متأكد من حذف هذا التصنيف؟</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>إلغاء</Button>
                <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
              </div>
            </div>
          </Modal>

          {/* جدول التصنيفات */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الاسم</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">التصنيف الأب</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">تم الإنشاء بواسطة</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">إجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {categoriesQuery.data?.map((c: Category) => (
                      <TableRow key={c.id}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.parent?.name || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.createdBy?.name || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(c)}>
                            <PencilIcon />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openDeleteModal(c.id)}>
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
