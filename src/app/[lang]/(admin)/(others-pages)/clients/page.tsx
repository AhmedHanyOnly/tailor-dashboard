'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useClients } from '@/hooks/useClients';
import { LoaderPage } from '@/components/LoaderPage';
import Button from '@/components/ui/button/Button';
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { toast } from 'sonner';
import { Client } from '@/api/methods/clients';

type ClientFormValues = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_no?: string;
};

export default function ClientsPage() {
  const { clientsQuery, createMutation, updateMutation, deleteMutation } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormValues>();

  if (clientsQuery.isLoading) return <LoaderPage />;
  if (clientsQuery.isError) return <div>حدث خطأ أثناء تحميل العملاء</div>;

  const openAddModal = () => {
    reset({ name: '', phone: '', email: '', address: '', tax_no: '' });
    setEditingClient(null);
    setIsOpen(true);
  };

  const openEditModal = (client: Client) => {
    reset({
      name: client.name,
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      tax_no: client.tax_no || '',
    });
    setEditingClient(client);
    setIsOpen(true);
  };

  const onSubmit = (data: ClientFormValues) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data });
      toast.success('تم تعديل العميل بنجاح');
    } else {
      createMutation.mutate(data);
      toast.success('تم إضافة العميل بنجاح');
    }
    setIsOpen(false);
  };

  const openDeleteModal = (id: number) => {
    setDeleteClientId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteClientId !== null) {
      deleteMutation.mutate(deleteClientId, {
        onSuccess: () => toast.success('تم حذف العميل بنجاح')
      });
    }
    setDeleteModalOpen(false);
    setDeleteClientId(null);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="العملاء" />
      <div className="space-y-6">
        <ComponentCard title="العملاء">
          <Button onClick={openAddModal} className="mb-4 flex items-center gap-2">
            <PlusIcon /> إضافة عميل
          </Button>

          {/* إضافة / تعديل عميل */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="m-4 max-w-[700px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                {editingClient ? 'تعديل العميل' : 'إضافة عميل جديد'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>الاسم</Label>
                  <Input {...register('name', { required: true })} />
                  {errors.name && <p className="text-red-500 text-sm">الاسم مطلوب</p>}
                </div>
                <div>
                  <Label>الهاتف</Label>
                  <Input {...register('phone')} />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input {...register('email')} />
                </div>
                <div>
                  <Label>العنوان</Label>
                  <Input {...register('address')} />
                </div>
                <div>
                  <Label>الرقم الضريبي</Label>
                  <Input {...register('tax_no')} />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
                <Button type="submit">{editingClient ? 'تعديل' : 'إضافة'}</Button>
              </div>
            </form>
          </Modal>

          {/* Modal حذف */}
          <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="m-4 max-w-[400px]">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl text-center">
              <p className="mb-6 text-gray-800 dark:text-white/90 text-lg">هل أنت متأكد من حذف هذا العميل؟</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>إلغاء</Button>
                <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
              </div>
            </div>
          </Modal>

          {/* جدول العملاء */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الاسم</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الهاتف</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">البريد الإلكتروني</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">العنوان</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">الرقم الضريبي</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">تم الإنشاء بواسطة</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">إجراءات</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {clientsQuery.data?.map((c: Client) => (
                      <TableRow key={c.id}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.phone || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.email || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.address || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.tax_no || '-'}</TableCell>
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
