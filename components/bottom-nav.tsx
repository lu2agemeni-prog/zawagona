'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Star, Bell } from '@/components/my-icons';

export default function BottomNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'الرئيسية', href: '/dashboard', icon: Home },
    { name: 'البحث', href: '/search', icon: Search },
    { name: 'التميز', href: '/premium', icon: Star },
    { name: 'الإشعارات', href: '/notifications', icon: Bell },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`relative inline-flex flex-col items-center justify-center px-5 hover:bg-slate-50/50 group transition-colors duration-200 ${
                isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <tab.icon className={`mb-1 h-6 w-6 transition-all duration-200 ${isActive ? 'text-primary-600 scale-110' : 'text-slate-400 group-hover:text-primary-600'}`} />
                {tab.name === 'الإشعارات' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] transition-all duration-200 ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
