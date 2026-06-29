'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Star, Bell } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'الرئيسية', href: '/dashboard', icon: Home },
    { name: 'البحث', href: '/search', icon: Search },
    { name: 'التميز', href: '/premium', icon: Star },
    { name: 'الإشعارات', href: '/notifications', icon: Bell },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-slate-200 bg-white">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-slate-50 group ${
                isActive ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <tab.icon className={`mb-1 h-6 w-6 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
              <span className="text-xs">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
