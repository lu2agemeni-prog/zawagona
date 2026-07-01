'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MithaqPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    if (agreed) {
      router.push('/onboarding/gender');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">ميثاق التعارف وأخلاقيات التطبيق</h1>
        
        <div className="h-64 overflow-y-auto bg-slate-50 p-4 rounded-md border border-slate-200 mb-6 text-sm text-slate-700 space-y-4">
          <p>
            بسم الله الرحمن الرحيم.
          </p>
          <p>
            بموافقتك على هذا الميثاق، فإنك تتعهد أمام الله عز وجل ثم أمام إدارة التطبيق بالآتي:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>أن الغرض من استخدام هذا التطبيق هو الزواج الشرعي فقط.</li>
            <li>عدم استخدام التطبيق لأي أغراض أخرى كالتعارف غير الجاد أو التسلية.</li>
            <li>الصدق التام في جميع البيانات المدخلة في الملف الشخصي.</li>
            <li>غض البصر واحترام خصوصية الآخرين.</li>
            <li>التحدث بأدب واحترام وبما لا يخالف الشرع.</li>
            <li>عدم طلب أي مبالغ مالية أو مساعدات من الأعضاء.</li>
          </ul>
          <p>
            أي مخالفة لهذه الشروط ستؤدي إلى الحظر النهائي من التطبيق دون سابق إنذار.
          </p>
        </div>

        <div className="flex items-center space-x-3 space-x-reverse mb-6">
          <input
            id="agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="agree" className="text-slate-800 font-medium">
            أقسم بالله العظيم أن ألتزم بهذا الميثاق وأن نيتي هي الزواج الشرعي
          </label>
        </div>

        <button
          onClick={handleNext}
          disabled={!agreed}
          className="w-full rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          أوافق وأتعهد
        </button>
      </div>
    </div>
  );
}
