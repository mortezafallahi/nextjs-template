'use client';

import { Button } from '@/components/ui/button';
import { SmoothCursor } from '@/components/ui/SmothCursor';
import { fontPrimary } from '@/config/fonts';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function GlobalError() {
  const router = useRouter();
  return (
    <div
      className={cn(
        'bg-background font-ye text-primary flex h-dvh flex-col items-center justify-center',
        fontPrimary.className
      )}
    >
      <SmoothCursor />
      <div
        className="font-sans font-bold"
        style={{ fontSize: 'clamp(6rem, 10vw, 10rem)' }}
      >
        500
      </div>

      <p className="my-8 text-3xl font-semibold">خطایی در سرور رخ داده</p>
      <div className="flex items-center gap-3">
        <Button className="cursor-none" onClick={() => router.back()}>
          بازگشت
        </Button>
        <Button
          className="cursor-none"
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </Button>
      </div>
    </div>
  );
}
