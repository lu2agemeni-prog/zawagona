'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Star, Bell, User, Heart, UserX, Users, Trophy, Phone, Share2, LogOut, Menu } from '@/components/icons';
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
    <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl md:shadow-[1px_0_15px_-5px_rgba(0,0,0,0.1)] md:border-l border-slate-100">
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-black text-primary-700 tracking-tight">مـودة</h2>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
            {profile.is_premium ? <Star className="h-6 w-6 fill-amber-500 text-amber-500" /> : <User className="h-6 w-6" />}
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">{profile.username || 'مستخدم'}</p>
            {profile.is_premium ? (
              <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">عضو متميز</span>
            ) : (
              <span className="text-xs text-slate-500 mt-1 block">عضو مجاني</span>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '#' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : item.highlight 
                    ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
                    : 'text-slate-600 hover:bg-surface-50 hover:text-primary-600'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ml-3 flex-shrink-0 transition-colors ${
                  isActive ? 'text-primary-600' : item.highlight ? 'text-amber-500 group-hover:text-amber-600' : 'text-slate-400 group-hover:text-primary-500'
                }`}
              />
              {item.name}
              {item.name === 'الإشعارات' && unreadCount > 0 && (
                <span className="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
        
        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 ml-3 flex-shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" />
            تسجيل الخروج
          </button>
        </div>
      </nav>
    </div>
  );

  if (mobile) {
    return (
      <>
        <button onClick={() => setIsOpen(true)} className="text-slate-500 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
          <Menu className="h-6 w-6" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
            <div className="relative flex w-full max-w-[280px] flex-1 flex-col bg-white mr-auto right-0 shadow-2xl animate-in slide-in-from-right duration-300">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  return <SidebarContent />;
}
