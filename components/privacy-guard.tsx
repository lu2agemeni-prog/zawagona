'use client';

import { useScreenshotPrevention } from '@/hooks/use-screenshot-prevention';

export function PrivacyGuard({ children }: { children: React.ReactNode }) {
  useScreenshotPrevention();
  return <>{children}</>;
}
