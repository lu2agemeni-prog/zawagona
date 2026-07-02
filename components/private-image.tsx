'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivateImageProps {
  src: string;
  alt: string;
  isPrivate: boolean;
  hasAccess: boolean;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function PrivateImage({ src, alt, isPrivate, hasAccess, className, fill, width, height }: PrivateImageProps) {
  const isBlurred = isPrivate && !hasAccess;
  const [imgSrc, setImgSrc] = useState(src.includes('avatar') ? `https://ui-avatars.com/api/?name=${alt}&background=random` : src);

  return (
    <div className={cn("relative overflow-hidden", className, fill ? "w-full h-full" : "")}>
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${alt}&background=random`)}
        className={cn(
          "object-cover transition-all duration-300 private-image w-full h-full",
          isBlurred ? "blur-xl scale-110" : ""
        )}
        referrerPolicy="no-referrer"
      />
      {isBlurred && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white p-2 text-center">
          <Lock className="w-8 h-8 mb-2 opacity-80" />
          <span className="text-xs font-medium opacity-90">الصورة مخفية</span>
          <span className="text-[10px] opacity-75 mt-1">اطلب الصلاحية لرؤيتها</span>
        </div>
      )}
    </div>
  );
}
