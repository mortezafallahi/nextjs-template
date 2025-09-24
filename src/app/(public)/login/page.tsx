'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSendOtpMutation, useVerifyOtpMutation } from '@/api/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  mobile: z.string().min(11, {
    message: 'شماره موبایل باید ۱۱ رقم باشد.',
  }),
  code: z.string().min(4, {
    message: 'کد تایید باید ۴ رقم باشد.',
  }),
});

export default function LoginPage() {
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: '',
      code: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // First, send OTP
    sendOtpMutation.mutate(
      { mobile: values.mobile },
      {
        onSuccess: (sendOtpResponse) => {
          // If OTP sent successfully, then verify OTP
          verifyOtpMutation.mutate(
            { mobile: values.mobile, code: values.code },
            {
              onSuccess: (verifyOtpResponse) => {
                if (
                  verifyOtpResponse.data.token &&
                  verifyOtpResponse.data.user
                ) {
                  setToken(verifyOtpResponse.data.token);
                  setUser(verifyOtpResponse.data.user);
                  router.push('/dashboard');
                }
              },
              onError: (error) => {
                console.error('OTP verification failed:', error);
                form.setError('code', {
                  type: 'server',
                  message: 'کد تایید نامعتبر است.',
                });
              },
            }
          );
        },
        onError: (error) => {
          console.error('Send OTP failed:', error);
          form.setError('mobile', {
            type: 'server',
            message: 'ارسال کد تایید با خطا مواجه شد.',
          });
        },
      }
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
          <CardDescription>
            برای ادامه، شماره موبایل و کد تایید خود را وارد کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره موبایل</FormLabel>
                    <FormControl>
                      <Input placeholder="09123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد تایید</FormLabel>
                    <FormControl>
                      <Input placeholder="4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={
                  sendOtpMutation.isPending || verifyOtpMutation.isPending
                }
              >
                {sendOtpMutation.isPending || verifyOtpMutation.isPending
                  ? 'در حال بررسی...'
                  : 'ورود'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-muted-foreground mt-4 text-center text-sm">
            حساب کاربری ندارید؟{' '}
            <Link href="/register" className="underline">
              ثبت‌نام کنید
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
