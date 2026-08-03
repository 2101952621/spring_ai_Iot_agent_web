import { Menu, Moon, Settings, Sparkles, Sun } from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { UserDropdown } from './UserDropdown';

interface ChatHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function ChatHeader({ title, onMenuClick }: ChatHeaderProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 border-b h-14 shrink-0 border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-white rounded-full shadow h-7 w-7 bg-gradient-to-br from-primary to-primary-light">
            <Sparkles size={14} />
          </div>
          <span className={cn('max-w-[180px] truncate font-semibold text-slate-800 dark:text-slate-100 md:max-w-xs')}>
            {title || '万物互联领航员'}
          </span>
          <span className="rounded bg-primary-50 dark:bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary dark:text-primary-light">
            1.0.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          title={isDark ? '切换亮色模式' : '切换暗色模式'}
          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <UserDropdown
          userName={user?.firstName || user?.email || '用户'}
          onLogout={logout}
        />
        <button className="rounded p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
