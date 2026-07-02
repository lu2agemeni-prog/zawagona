'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Bell, User, MessageCircle, Heart, Star, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationsClient({ initialNotifications = [] }: { initialNotifications?: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const supabase = createClient();
  const router = useRouter();

  const handleMarkAsRead = async (id: string, actionLink: string | null) => {
    // Update local state first
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    // Update DB
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    
    // Redirect if there's an action link
    if (actionLink) {
      router.push(actionLink);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'like': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'visit': return <User className="w-5 h-5 text-emerald-500" />;
      case 'system': return <Star className="w-5 h-5 text-amber-500" />;
      case 'photo_request': return <CheckCircle className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          الإشعارات الأخيرة
          {unreadCount > 0 && (
            <span className="mr-3 bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-medium">
              {unreadCount} جديد
            </span>
          )}
        </h2>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id, notification.action_link)}
                className={`p-4 md:p-6 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${!notification.is_read ? 'bg-indigo-50/30' : ''}`}
              >
                <div className={`p-3 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <p className={`text-slate-800 ${!notification.is_read ? 'font-semibold' : 'font-medium'}`}>
                    {notification.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(notification.created_at).toLocaleString('ar-EG')}</span>
                  </div>
                </div>
                
                {!notification.is_read && (
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد إشعارات</h3>
            <p className="text-slate-500">ليس لديك أي إشعارات جديدة في الوقت الحالي.</p>
          </div>
        )}
      </div>
    </div>
  );
}
