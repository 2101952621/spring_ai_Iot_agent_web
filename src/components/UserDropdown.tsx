import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  ImageIcon,
  LogOut,
  RefreshCw,
  Settings,
  User,
} from 'lucide-react';
import { cn } from '@/utils';

interface UserDropdownProps {
  userName: string;
  role?: string;
  onLogout: () => void;
}

export function UserDropdown({ userName, role, onLogout }: UserDropdownProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: '账号设置', onClick: () => navigate('/account') },
    { icon: ImageIcon, label: 'Logo设置', onClick: () => {} },
    { type: 'divider' as const },
    { icon: RefreshCw, label: '切换登录', onClick: () => {} },
    { icon: Settings, label: '版本说明', onClick: () => navigate('/version-notes') },
    { type: 'divider' as const },
    { icon: LogOut, label: '退出系统', onClick: onLogout },
  ];

  return (
    <>
      <div ref={ref} className="relative">
        {/* 触发按钮 */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
            open
              ? 'bg-slate-100 dark:bg-slate-800 text-primary'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          <User size={14} />
          <span className="max-w-[80px] truncate hidden sm:inline">{userName}</span>
          <ChevronDown
            size={14}
            className={cn('transition-transform', open && 'rotate-180')}
          />
        </button>

        {/* 下拉菜单 */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-float py-2 z-50">
            {/* 用户信息头部 */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{userName}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500">{role || '员工'}</div>
              </div>
              <button
                onClick={() => {}}
                className="flex items-center gap-1 rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary hover:bg-primary-50 dark:hover:bg-primary/10 transition-colors"
              >
                切换用户
                <ChevronRight size={12} />
              </button>
            </div>

            {/* 菜单项 */}
            <div className="mt-1 border-t border-slate-100 dark:border-slate-700 pt-1">
              {menuItems.map((item, idx) => {
                if ('type' in item && item.type === 'divider') {
                  return (
                    <div
                      key={`divider-${idx}`}
                      className="my-1 border-t border-slate-100 dark:border-slate-700"
                    />
                  );
                }
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setOpen(false);
                      item.onClick();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Icon size={16} className="text-slate-400 dark:text-slate-500" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
