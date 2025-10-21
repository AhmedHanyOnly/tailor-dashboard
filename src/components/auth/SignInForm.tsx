'use client';

import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/methods/auth';
import { useAuthStore } from '@/store/useAuthStore';

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [Loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));

        // تحديث Zustand
        useAuthStore.getState().setAuth(data.data, data.token);

        // تخزين الكوكيز (في حال SSR)
        document.cookie = `token=${data.token}; path=/; SameSite=Lax`;
        setLoader(false);
        toast.success(data.message || t('login.loginSuccess'));
        router.push('/');
      } else {
        toast.error(data.message);
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      setLoader(false);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    setLoader(true);
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            {t('login.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Email */}
            <div>
              <Label>
                {t('login.email')} <span className="text-error-500">*</span>
              </Label>
              <Input
                {...register('email', { required: t('login.emailRequired') })}
                placeholder={t('login.emailPlaceholder')}
                type="email"
              />
              {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div>
              <Label>
                {t('login.password')} <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...register('password', { required: t('login.passwordRequired') })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.passwordPlaceholder')}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-theme-sm block font-normal text-gray-700 dark:text-gray-400">
                  {t('login.rememberMe')}
                </span>
              </div>
              {/* <Link
                href="/reset-password"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
              >
                {t('login.forgotPassword')}
              </Link> */}
            </div>

            {/* Submit */}
            <div>
              <Button className="w-full" size="sm" disabled={Loader}>
                {Loader ? t('login.loggingIn') : t('login.loginButton')}
              </Button>
            </div>
          </div>
        </form>

        {/* <div className="mt-5">
          <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
            {t('login.noAccount')}{' '}
            <Link
              href="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {t('login.signUp')}
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}
