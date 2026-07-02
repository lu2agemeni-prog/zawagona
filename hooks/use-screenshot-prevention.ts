'use client';

import { useEffect } from 'react';

export function useScreenshotPrevention() {
  useEffect(() => {
    // Prevent print screen key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('Screenshots are disabled for privacy reasons.');
        alert('غير مسموح بأخذ لقطات شاشة لحماية خصوصية الأعضاء.');
      }
    };

    // Hide content when window loses focus (often happens during screenshot tools)
    const handleBlur = () => {
      document.body.style.filter = 'blur(10px)';
    };

    const handleFocus = () => {
      document.body.style.filter = 'none';
    };

    // Prevent context menu (right click -> save image)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
}
