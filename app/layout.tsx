import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css'; // Global styles

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'تطبيق مودة للتعارف الإسلامي',
  description: 'تطبيق للتعارف بغرض الزواج على الطريقة الإسلامية',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="font-cairo bg-slate-50 text-slate-900" suppressHydrationWarning>{children}</body>
    </html>
  );
}
