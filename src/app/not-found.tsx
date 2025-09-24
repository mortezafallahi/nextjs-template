'use client';

import { Button } from '@/components/ui/button';
import { SmoothCursor } from '@/components/ui/SmothCursor';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background text-primary flex h-dvh flex-col items-center justify-center">
      <SmoothCursor />
      <div
        className="font-sans font-bold"
        style={{ fontSize: 'clamp(6rem, 10vw, 10rem)' }}
      >
        404
      </div>

      <p className="my-8 text-3xl font-semibold">صفحه مورد نظر یافت نشد</p>
      <Button asChild className="cursor-none">
        <Link href="/">بازگشت</Link>
      </Button>
    </div>
  );
}
