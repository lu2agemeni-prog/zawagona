'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Star, Bell, User, Heart, UserX, Users, Trophy, Phone, Share2, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Sidebar({ profile, mobile = false, unreadCount = 0 }: { profile: any, mobile?: boolean, unreadCount?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const menuItems = [
    { name: 'الرئيسية', href: '/dashboard', icon: Home },
    { name: 'الإشعارات', href: '/notifications', icon: Bell },
    { name: 'الملف الشخصي', href: '/profile', icon: User },
    { name: 'قائمة الاهتمامات', href: '/interests', icon: Heart },
    { name: 'قائمة التجاهل', href: '/ignored', icon: UserX },
    { name: 'من يهتم بي', href: '/interested-in-me', icon: Users },
    { name: 'من زار ملفي', href: '/visitors', icon: Users },
    { name: 'قصص النجاح', href: '/success-stories', icon: Trophy },
    { name: 'الانضمام لباقة التميز', href: '/premium', icon: Star, highlight: true },
    { name: 'اتصل بنا', href: '/contact', icon: Phone },
    { name: 'مشاركة التطبيق', href: '#', icon: Share2 },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col overflow-y-auto bg-white py-4 shadow-xl md:shadow-none">
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">تطبيق مودة</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
            {profile.is_premium ? '👑' : '👤'}
          </div>
          <div>
            <p className="font-semibold text-sm">{profile.username || 'مستخدم'}</p>
            {profile.is_premium && <span className="text-xs text-amber-500 font-bold">عضو متميز</span>}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : item.highlight 
                    ? 'text-amber-600 hover:bg-amber-50' 
                    : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ml-3 flex-shrink-0 ${
                  isActive ? 'text-indigo-600' : item.highlight ? 'text-amber-600' : 'text-slate-400'
                }`}
              />
              {item.name}
              {item.name === 'الإشعارات' && unreadCount > 0 && (
                <span className="mr-auto inline-block rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5 ml-3 flex-shrink-0 text-red-500" />
          تسجيل الخروج
        </button>
      </nav>
    </div>
  );

  if (mobile) {
    return (
      <>
        <button onClick={() => setIsOpen(true)} className="text-slate-500">
          <Menu className="h-6 w-6" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)}></div>
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white mr-auto right-0">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  return <SidebarContent />;
}
