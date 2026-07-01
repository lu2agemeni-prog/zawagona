import { Menu } from 'lucide-react';
import Sidebar from './sidebar';

interface MobileHeaderProps {
  title: string;
  profile?: any;
  unreadCount?: number;
}

export default function MobileHeader({ title, profile, unreadCount = 0 }: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-white h-16 border-b border-slate-100 flex items-center px-4 justify-between sticky top-0 z-40 shadow-sm font-cairo">
      <Sidebar profile={profile} mobile={true} unreadCount={unreadCount} />
      <span className="text-xl font-black text-slate-900 tracking-tight">{title}</span>
      <div className="w-8"></div>
    </header>
  );
}
