'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';
import { LoaderPage } from '@/components/LoaderPage';
import Button from '@/components/ui/button/Button';
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { toast } from 'sonner';
import { Product } from '@/api/methods/products';

type ProductFormValues = {
  name: string;
  code?: string;
  barcode?: string;
  price?: string;
  quantity?: number;
};

export default function ProductsPage() {
  const { productsQuery, createMutation, updateMutation, deleteMutation } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>();

  if (productsQuery.isLoading) return <LoaderPage />;
  if (productsQuery.isError) return <div>حدث خطأ أثناء تحميل المنتجات</div>;

  const openAddModal = () => {
    reset({ name: '', code: '', barcode: '', price: '', quantity: 0 });
    setEditingProduct(null);
    setIsOpen(true);
  };

  const openEditModal = (product: Product) => {
    reset({
      name: product.name,
      code: product.code || '',
      barcode: product.barcode || '',
      price: product.price || '',
      quantity: product.quantity || 0,
    });
    setEditingProduct(product);
    setIsOpen(true);
  };

  const onSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
      toast.success('تم تعديل المنتج بنجاح');
    } else {
      createMutation.mutate(data);
      toast.success('تم إضافة المنتج بنجاح');
    }
    setIsOpen(false);
  };

  const openDeleteModal = (id: string) => {
    setDeleteProductId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      deleteMutation.mutate(deleteProductId, {
        onSuccess: () => toast.success('تم حذف المنتج بنجاح')
      });
    }
    setDeleteModalOpen(false);
    setDeleteProductId(null);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="المنتجات" />
      <div className="space-y-6">
        <ComponentCard title="المنتجات">
          <Button onClick={openAddModal} className="mb-4 flex items-center gap-2">
            <PlusIcon /> إضافة منتج
          </Button>

          {/* إضافة / تعديل منتج */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="m-4 max-w-[700px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <Input {...register('name', { required: true })} />
                  {errors.name && <p className="text-red-500 text-sm">الاسم مطلوب</p>}
                </div>
                <div>
                  <Label>الكود</Label>
                  <Input {...register('code')} />
                </div>
                <div>
                  <Label>الباركود</Label>
                  <Input {...register('barcode')} />
                </div>
                <div>
                  <Label>السعر</Label>
                  <Input type="number" {...register('price')} />
                </div>
                <div>
                  <Label>الكمية</Label>
                  <Input type="number" {...register('quantity')} />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
                <Button type="submit">{editingProduct ? 'تعديل' : 'إضافة'}</Button>
              </div>
            </form>
          </Modal>

          {/* Modal حذف */}
          <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="m-4 max-w-[400px]">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl text-center">
              <p className="mb-6 text-gray-800 dark:text-white/90 text-lg">هل أنت متأكد من حذف هذا المنتج؟</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>إلغاء</Button>
                <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
              </div>
            </div>
          </Modal>

          {/* جدول المنتجات */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الاسم</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الكود</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الباركود</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">السعر</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الكمية</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">إجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {productsQuery.data?.map((p: Product) => (
                      <TableRow key={p.id}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.code || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.barcode || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.price || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.quantity || 0}</TableCell>
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
