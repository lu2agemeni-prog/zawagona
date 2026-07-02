'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Save, Image as ImageIcon, Shield, User, Sliders } from 'lucide-react';
import { PrivateImage } from '@/components/private-image';

export default function SettingsClient({ profile, initialPhotos }: { profile: any, initialPhotos: any[] }) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'photos' | 'preferences'>('profile');
  
  // Profile state
  const [formData, setFormData] = useState({
    display_name: profile.display_name || '',
    phone_number: profile.phone_number || '',
    about_me: profile.about_me || '',
    is_photo_private: profile.is_photo_private || false,
    pref_age_min: profile.pref_age_min || 18,
    pref_age_max: profile.pref_age_max || 50,
    pref_marital_status: profile.pref_marital_status || '',
    pref_residence: profile.pref_residence || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState(initialPhotos);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      await supabase.from('profiles').update(formData).eq('id', user.id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase.from('user_photos').insert({
        user_id: user.id,
        url: newPhotoUrl,
        is_private: formData.is_photo_private
      }).select().single();
      
      if (data) {
        setPhotos([data, ...photos]);
        setNewPhotoUrl('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await supabase.from('user_photos').delete().eq('id', id);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" /> البيانات الشخصية
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'photos'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> معرض الصور
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" /> تفضيلات البحث
        </button>
      </div>

      <div className="p-6 md:p-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">
            تم حفظ التعديلات بنجاح!
          </div>
        )}

        {(activeTab === 'profile' || activeTab === 'preferences') && (
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'profile' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">الاسم المستعار (يظهر للآخرين)</label>
                    <input
                      type="text"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="مثال: أحمد، أبو محمد، سارة..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">رقم الهاتف (للتواصل الإداري فقط)</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="مثال: +966..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">نبذة عني</label>
                  <textarea
                    name="about_me"
                    value={formData.about_me}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="تحدث عن نفسك، شخصيتك، وما تبحث عنه..."
                  />
                </div>
              </>
            )}

            {activeTab === 'preferences' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">العمر المطلوب (من)</label>
                    <input
                      type="number"
                      name="pref_age_min"
                      value={formData.pref_age_min}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">العمر المطلوب (إلى)</label>
                    <input
                      type="number"
                      name="pref_age_max"
                      value={formData.pref_age_max}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">الحالة الاجتماعية المطلوبة</label>
                    <select
                      name="pref_marital_status"
                      value={formData.pref_marital_status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="">لا يهم</option>
                      <option value="عازب/ة">عازب/ة</option>
                      <option value="مطلق/ة">مطلق/ة</option>
                      <option value="أرمل/ة">أرمل/ة</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">بلد الإقامة المطلوب</label>
                    <input
                      type="text"
                      name="pref_residence"
                      value={formData.pref_residence}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="مثال: السعودية، مصر (اتركه فارغاً إن لم يهم)"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                حفظ التعديلات
              </button>
            </div>
          </form>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">إضافة صورة جديدة</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="أدخل رابط الصورة (URL)..."
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleAddPhoto}
                  disabled={loading || !newPhotoUrl}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  إضافة
                </button>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_photo_private"
                  checked={formData.is_photo_private}
                  onChange={async (e) => {
                    handleChange(e);
                    // Also save immediately
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      await supabase.from('profiles').update({ is_photo_private: e.target.checked }).eq('id', user.id);
                    }
                  }}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" /> جعل صوري خاصة (يتطلب إذن للرؤية)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group">
                  <PrivateImage
                    src={photo.url}
                    alt="صورة شخصية"
                    fill
                    isPrivate={false}
                    hasAccess={true}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
              
              {photos.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                  لم تقم بإضافة أي صور بعد
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
