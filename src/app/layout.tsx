import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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

const APP_NAME = 'Mark Counter';
const APP_DEFAULT_TITLE = 'شمارنده بازی مارک مخصوص دزفولیا';
const APP_TITLE_TEMPLATE = '%s - PWA App';
const APP_DESCRIPTION = 'اپلیکیشن ثبت امتیاز بازی با قابلیت ذخیره خودکار';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    startupImage: [
      {
        url: 'dez-bridge.jpg',
        media: 'all',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  other: { 'apple-mobile-web-app-capable': 'yes' }, // add this line
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
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
        <link
          rel='apple-touch-startup-image'
          href='dez-bridge.jpg'
          media='all'
        />
      </head>
      <body
        className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-vazir`}
      >
        <div
          style={{
            backgroundImage: 'url(/dez-bridge.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className='backdrop-blur-md p-4 bg-black/50'>
            <h1 className='text-3xl drop-shadow-md font-extrabold text-center mb-5'>
              شمارنده بازی مارک
            </h1>
            <div className='container mx-auto px-4'>{children}</div>
            <p className='drop-shadow-md text-white my-5 text-center text-xs'>
              ساخته شده با عشق توسط مسعود برای بروبچون دسفیل -{' '}
              <Link className='underline' href={'/rules'}>
                قوانین و مقررات
              </Link>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
