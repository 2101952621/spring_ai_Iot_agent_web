import { LogOut, Menu, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';

interface ChatHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function ChatHeader({ title, onMenuClick }: ChatHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 border-b h-14 shrink-0 border-slate-100 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-white rounded-full shadow h-7 w-7 bg-gradient-to-br from-primary to-primary-light">
            <Sparkles size={14} />
          </div>
          <span className={cn('max-w-[180px] truncate font-semibold text-slate-800 md:max-w-xs')}>
            {title || '万物互联领航员'}
          </span>
          <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            1.0.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-slate-500 sm:inline">
          {user?.firstName || user?.email || '用户'}
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          <LogOut size={14} />
          退出
        </button>
        <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
