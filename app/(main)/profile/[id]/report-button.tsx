'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShieldAlert } from '@/components/icons';

export default function ReportButton({ reportedId, currentUserId }: { reportedId: string, currentUserId?: string }) {
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !reason.trim()) return;
    
    setSubmitting(true);
    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id: currentUserId,
        reported_id: reportedId,
        reason: reason
      });
      
    setSubmitting(false);
    
    if (!error) {
      setSuccess(true);
      setTimeout(() => setShowDialog(false), 3000);
    }
  };

  if (!currentUserId) return null;

  return (
    <>
      <button 
        onClick={() => setShowDialog(true)}
        className="text-slate-400 hover:text-red-600 flex items-center text-sm transition"
      >
        <ShieldAlert className="h-4 w-4 mr-1" /> إبلاغ عن إساءة
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <ShieldAlert className="h-5 w-5 text-red-600 mr-2" />
              الإبلاغ عن العضو
            </h3>
            
            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4 text-sm">
                تم إرسال البلاغ بنجاح. ستقوم الإدارة بمراجعته في أقرب وقت.
              </div>
            ) : (
              <form onSubmit={handleReport}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">سبب الإبلاغ</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-md border-gray-300 py-2 px-3 border focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                    placeholder="يرجى توضيح سبب الإبلاغ بدقة..."
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting || !reason.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition disabled:opacity-50"
                  >
                    {submitting ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
