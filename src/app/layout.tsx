import { AuthProvider } from '@/components/providers/AuthProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { fontPrimary } from '@/config/fonts';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.healthapp.pro'),

  description:
    'با اپلیکیشن هلث اپ به اهداف سلامتی خود برسید. دریافت برنامه غذایی، برنامه ورزشی و مشاوره آنلاین از متخصصین.',

  openGraph: {
    title: 'هلث اپ',
    description: 'به پلتفرم جامع سلامتی هلث اپ خوش آمدید.',
    url: 'https://www.healthapp.pro',
    siteName: 'هلث اپ',
    images: [
      {
        url: '/images/square-logo.png',
        width: 630,
        height: 630,
      },
    ],
    locale: 'fa_IR',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  twitter: {
    card: 'summary_large_image',
    title: 'هلث اپ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="fa"
      dir="rtl"
      className={fontPrimary.className}
    >
      <body
        className="bg-background text-foreground h-full min-h-dvh w-full antialiased"
        suppressHydrationWarning={true}
      >
        <Toaster />
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
