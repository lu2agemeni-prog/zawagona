'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Check, X, ShieldAlert, Star } from '@/components/my-icons';

export default function AdminClient() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [premiumRequests, setPremiumRequests] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch pending approvals
    const { data: users } = await supabase
      .from('profiles')
      .select('id, username, created_at, gender')
      .eq('is_approved', false)
      .eq('is_admin', false)
      .order('created_at', { ascending: false });
      
    if (users) setPendingUsers(users);

    // Fetch premium requests
    const { data: premium } = await supabase
      .from('premium_requests')
      .select('*, profiles(username)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (premium) setPremiumRequests(premium);

    // Fetch reports
    const { data: rep } = await supabase
      .from('reports')
      .select('*, reporter:profiles!reporter_id(username), reported:profiles!reported_id(username)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (rep) setReports(rep);

    setLoading(false);
  };

  const handleApproveUser = async (id: string) => {
    await supabase.rpc('admin_update_profile', { target_id: id, new_is_approved: true, new_is_premium: null });
    setPendingUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleApprovePremium = async (id: string, userId: string, packageName: string) => {
    let daysToAdd = 30; // default
    if (packageName === 'أسبوعي') daysToAdd = 7;
    if (packageName === 'شهري') daysToAdd = 30;
    if (packageName === '3 شهور') daysToAdd = 90;
    if (packageName === '6 أشهر') daysToAdd = 180;
    if (packageName === 'سنوي') daysToAdd = 365;

    await supabase.rpc('admin_approve_premium', { request_id: id, target_user_id: userId, days_to_add: daysToAdd });
    setPremiumRequests(prev => prev.filter(p => p.id !== id));
  };

  const handleResolveReport = async (id: string) => {
    await supabase.rpc('admin_resolve_report', { report_id: id });
    setReports(prev => prev.filter(r => r.id !== id));
  };

  if (loading) {
    return <div className="p-8 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Pending Approvals */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-800">
          أعضاء قيد المراجعة ({pendingUsers.length})
        </div>
        <div className="divide-y divide-slate-100">
          {pendingUsers.length === 0 ? (
            <div className="p-6 text-center text-slate-500">لا يوجد أعضاء قيد المراجعة</div>
          ) : (
            pendingUsers.map(user => (
              <div key={user.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-bold">{user.username || 'عضو'}</div>
                  <div className="text-sm text-slate-500">النوع: {user.gender === 'male' ? 'ذكر' : 'أنثى'} • تاريخ التسجيل: {new Date(user.created_at).toLocaleDateString('ar-EG')}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => window.open(`/profile/${user.id}`, '_blank')} className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm">عرض</button>
                  <button onClick={() => handleApproveUser(user.id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center text-sm"><Check className="w-4 h-4 mr-1" /> قبول</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Premium Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 font-bold text-amber-800 flex items-center">
          <Star className="w-5 h-5 mr-2" /> طلبات التميز ({premiumRequests.length})
        </div>
        <div className="divide-y divide-slate-100">
          {premiumRequests.length === 0 ? (
            <div className="p-6 text-center text-slate-500">لا يوجد طلبات تميز</div>
          ) : (
            premiumRequests.map(req => (
              <div key={req.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-bold">{req.profiles?.username || 'عضو'}</div>
                  <div className="text-sm text-amber-600 font-medium">الباقة: {req.package_name}</div>
                </div>
                <button onClick={() => handleApprovePremium(req.id, req.user_id, req.package_name)} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm font-bold flex items-center">
                  <Check className="w-4 h-4 mr-1" /> تفعيل الباقة
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 font-bold text-red-800 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2" /> البلاغات ({reports.length})
        </div>
        <div className="divide-y divide-slate-100">
          {reports.length === 0 ? (
            <div className="p-6 text-center text-slate-500">لا يوجد بلاغات معلقة</div>
          ) : (
            reports.map(rep => (
              <div key={rep.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">
                    المُبلِغ: <span className="font-bold text-slate-800">{rep.reporter?.username}</span> 
                    {' -> '} المُبلَغ عنه: <span className="font-bold text-slate-800">{rep.reported?.username}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700 text-sm">
                    {rep.reason}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => window.open(`/profile/${rep.reported_id}`, '_blank')} className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm">عرض المتهم</button>
                  <button onClick={() => handleResolveReport(rep.id)} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">إغلاق البلاغ</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
