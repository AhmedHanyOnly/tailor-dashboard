'use client';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSettings } from '@/hooks/useSettings';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { LoaderPage } from '@/components/LoaderPage';
import { toast } from 'sonner';
import { SiteSettings } from '@/api/methods/settings';
import { useUserTimeZone } from '@/hooks/useTimeZone';
import { useLookup } from '@/hooks/useLookup';
import Select from '@/components/form/Select';

export default function SettingsPage() {
  const { settingsQuery, updateMutation } = useSettings();
  const { lookupQuery } = useLookup();
  const timeZone = useUserTimeZone();
  console.log('User Time Zone:', timeZone);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<SiteSettings>();

  useEffect(() => {
    if (settingsQuery.data) {
      const formattedData = settingsQuery.data.reduce((acc: any, item: any) => {
        acc[item.key] = ['default_currency_id', 'default_plan_id'].includes(item.key)
          ? Number(item.value)
          : item.value;
        return acc;
      }, {});
      reset(formattedData);
    }
  }, [settingsQuery.data, reset]);

  const onSubmit = (values: SiteSettings) => {
    const formData = new FormData();

    // تحويل Boolean / string 1/0
    [
      'is_maintenance_mode',
      'enable_tax',
      'auto_suspend_unpaid_tenants',
      'allow_registration',
    ].forEach((key) => formData.append(key, values[key as keyof SiteSettings] ? '1' : '0'));

    formData.append('_method', 'PUT');
    formData.append('site_name', values.site_name);
    formData.append('timezone', timeZone);
    formData.append('company_email', values.company_email);
    formData.append('company_phone', values.company_phone);
    formData.append('company_address', values.company_address);
    formData.append('maintenance_message', values.maintenance_message);
    formData.append('default_currency_id', String(values.default_currency_id));
    formData.append('default_plan_id', String(values.default_plan_id));
    formData.append('tax_percentage', String(values.tax_percentage));

    if (values.site_logo && values.site_logo[0]) formData.append('site_logo', values.site_logo[0]);
    if (values.site_favicon && values.site_favicon[0])
      formData.append('site_favicon', values.site_favicon[0]);

    updateMutation.mutate(formData, {
      onSuccess: () => toast.success('تم حفظ الإعدادات بنجاح'),
      onError: (err) => toast.error(err.response?.data?.message),
    });
  };

  if (settingsQuery.isLoading || lookupQuery.isLoading) return <LoaderPage />;
  if (settingsQuery.isError || lookupQuery.isError) return <p>حدث خطأ أثناء تحميل الإعدادات</p>;

  const renderSwitch = (field: any) => {
    const isChecked = field.value === '1' || field.value === 1 || field.value === true;
    return (
      <Switch defaultChecked={isChecked} onChange={(val) => field.onChange(val ? '1' : '0')} />
    );
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="إعدادات الموقع" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* قسم أساسي */}
        <div>
          <Label>اسم الموقع</Label>
          <Input {...register('site_name')} placeholder="اسم الموقع" />
        </div>

        <div>
          <Label>المنطقة الزمنية</Label>
          <Input placeholder={timeZone} disabled />
        </div>

        <div>
          <Label>البريد الإلكتروني</Label>
          <Input {...register('company_email')} placeholder="example@email.com" />
        </div>

        <div>
          <Label>رقم الهاتف</Label>
          <Input {...register('company_phone')} placeholder="رقم الهاتف" />
        </div>

        <div className="md:col-span-2">
          <Label>عنوان الشركة</Label>
          <Input {...register('company_address')} placeholder="العنوان" />
        </div>

        {/* قسم الملفات */}
        <div>
          <Label>الشعار</Label>
          <Input type="file" accept="image/*" {...register('site_logo')} />
        </div>

        <div>
          <Label>الأيقونة</Label>
          <Input type="file" accept="image/*" {...register('site_favicon')} />
        </div>

        {/* قسم الخطط والعملات */}
        <div>
          <Label>العملة الافتراضية</Label>
          <Controller
            name="default_currency_id"
            control={control}
            render={({ field }) => {
              const options =
                lookupQuery.data?.data.currencies.map((c: any) => ({
                  value: c.id,
                  label: c.name,
                })) || [];

              return (
                <Select
                  options={options}
                  value={field.value ?? undefined} // القيمة تكون رقم أو undefined
                  onChange={(val: number) => field.onChange(val)} // ترجع رقم مباشر
                  placeholder="اختر العملة"
                />
              );
            }}
          />
        </div>

        <div>
          <Label>الخطة الافتراضية</Label>
          <Controller
            name="default_plan_id"
            control={control}
            render={({ field }) => (
              <Select
                options={
                  lookupQuery.data?.data.plans.map((p: any) => ({ value: p.id, label: p.name })) ||
                  []
                }
                value={field.value ? Number(field.value) : undefined}
                onChange={(val) => field.onChange(val)}
                placeholder="اختر الخطة"
              />
            )}
          />
        </div>

        {/* السويتشات */}
        <div>
          <Label>تفعيل الضريبة</Label>
          <Controller
            name="enable_tax"
            control={control}
            render={({ field }) => renderSwitch(field)}
          />
        </div>

        <div>
          <Label>نسبة الضريبة (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            {...register('tax_percentage', { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label>وضع الصيانة</Label>
          <Controller
            name="is_maintenance_mode"
            control={control}
            render={({ field }) => renderSwitch(field)}
          />
        </div>

        <div className="md:col-span-2">
          <Label>رسالة الصيانة</Label>
          <Controller
            name="maintenance_message"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={6} placeholder="الرسالة التي تظهر أثناء الصيانة" />
            )}
          />
        </div>

        <div>
          <Label>تفعيل التسجيل للمتاجر</Label>
          <Controller
            name="allow_registration"
            control={control}
            render={({ field }) => renderSwitch(field)}
          />
        </div>

        <div>
          <Label>إيقاف المحلات عند عدم الدفع تلقائياً</Label>
          <Controller
            name="auto_suspend_unpaid_tenants"
            control={control}
            render={({ field }) => renderSwitch(field)}
          />
        </div>

        <div>
          <Label>عدد الأيام قبل الإيقاف</Label>
          <Input type="number" {...register('suspend_after_days', { valueAsNumber: true })} />
        </div>

        {/* زر الحفظ */}
        <div className="mt-4 md:col-span-2">
          <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
            {updateMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </form>
    </div>
  );
}
