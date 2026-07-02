'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { PrivateImage } from '@/components/private-image';
import { Check, X, Clock } from 'lucide-react';

export default function PhotoRequestsClient({ 
  receivedRequests, 
  sentRequests 
}: { 
  receivedRequests: any[], 
  sentRequests: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [requests, setRequests] = useState(receivedRequests);
  const [mySentRequests, setMySentRequests] = useState(sentRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setLoadingId(id);
    try {
      await supabase
        .from('photo_permissions')
        .update({ status: action })
        .eq('id', id);
        
      setRequests(requests.map(req => req.id === id ? { ...req, status: action } : req));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setLoadingId(id);
    try {
      await supabase
        .from('photo_permissions')
        .delete()
        .eq('id', id);
        
      setMySentRequests(mySentRequests.filter(req => req.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'received'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          الطلبات المستلمة ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'sent'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          الطلبات المرسلة ({mySentRequests.length})
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'received' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                لا توجد طلبات مستلمة حالياً
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 relative bg-white border border-slate-200">
                    <PrivateImage
                      src={request.requester.avatar_url || (request.requester.gender === 'female' ? '/avatars/avatar_f2.png' : '/avatars/avatar1.png')}
                      alt={request.requester.username || 'مستخدم'}
                      fill
                      isPrivate={false}
                      hasAccess={true}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-right">
                    <Link href={`/profile/${request.requester.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
                      {request.requester.full_name || request.requester.username}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      طلب رؤية صورتك الشخصية
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                    {request.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAction(request.id, 'approved')}
                          disabled={loadingId === request.id}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" /> موافقة
                        </button>
                        <button
                          onClick={() => handleAction(request.id, 'rejected')}
                          disabled={loadingId === request.id}
                          className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" /> رفض
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                        request.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {request.status === 'approved' ? 'تمت الموافقة' : 'مرفوض'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="space-y-4">
            {mySentRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                لم تقم بإرسال أي طلبات بعد
              </div>
            ) : (
              mySentRequests.map((request) => (
                <div key={request.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 relative bg-white border border-slate-200">
                    <PrivateImage
                      src={request.target.avatar_url || (request.target.gender === 'female' ? '/avatars/avatar_f2.png' : '/avatars/avatar1.png')}
                      alt={request.target.username || 'مستخدم'}
                      fill
                      isPrivate={true}
                      hasAccess={request.status === 'approved'}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-right">
                    <Link href={`/profile/${request.target.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
                      {request.target.full_name || request.target.username}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {request.status === 'pending' && 'في انتظار الموافقة على طلبك'}
                      {request.status === 'approved' && 'تمت الموافقة، يمكنك الآن رؤية الصورة'}
                      {request.status === 'rejected' && 'تم رفض طلبك'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(request.id)}
                        disabled={loadingId === request.id}
                        className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        إلغاء الطلب
                      </button>
                    )}
                    {request.status === 'approved' && (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <Check className="w-4 h-4" /> تمت الموافقة
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-sm font-medium">
                        <X className="w-4 h-4" /> مرفوض
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
