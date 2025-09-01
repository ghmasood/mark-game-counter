import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const vazir = Vazirmatn({
  variable: '--font-vazir',
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'شمارنده بازی مارک مخصوص دزفولیا',
  description: 'اپلیکیشن ثبت امتیاز بازی با قابلیت ذخیره خودکار',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fa' dir='rtl'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
      </head>
      <body
        className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-vazir`}
      >
        {children}
      </body>
    </html>
  );
}
