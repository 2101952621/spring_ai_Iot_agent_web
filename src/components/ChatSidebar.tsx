import { ChevronLeft, ChevronRight, History, MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { cn, formatTime } from '@/utils';
import type { ChatSessionVO } from '@/types';

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  sessions: Record<string, ChatSessionVO[]>;
  currentSessionId: string;
  onSelect: (sessionId: string) => void;
  onNew: () => void;
  onDelete: (sessionId: string) => void;
}

export function ChatSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
  sessions,
  currentSessionId,
  onSelect,
  onNew,
  onDelete,
}: ChatSidebarProps) {
  return (
    <>
      {/* 遮罩 */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-float transition-all duration-300 md:static md:translate-x-0',
          collapsed ? 'w-14 items-center' : 'w-72',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div
          className={cn(
            'flex items-center py-3',
            collapsed ? 'flex-col justify-center px-2' : 'justify-between px-4',
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <MessageSquare size={18} />
              </div>
              历史会话
            </div>
          )}

          {/* 移动端关闭按钮 */}
          <button
            onClick={onClose}
            className={cn('rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden', collapsed && 'mb-2')}
          >
            <X size={18} />
          </button>

          {/* 桌面端折叠/展开按钮 */}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? '展开' : '折叠'}
            className={cn(
              'hidden rounded p-1 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary',
              collapsed && 'mt-2',
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {!collapsed && (
          <>
            <div className="px-3 pb-2">
              <button
                onClick={onNew}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary-50 dark:bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                <Plus size={16} />
                新建会话
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
              {Object.entries(sessions).map(([group, list]) =>
                list.length > 0 ? (
                  <div key={group} className="mb-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <History size={12} />
                      {group}
                    </div>
                    <div className="space-y-1">
                      {list.map((session) => (
                        <div
                          key={session.sessionId}
                          className={cn(
                            'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                            currentSessionId === session.sessionId
                              ? 'bg-primary-50 dark:bg-primary/20 text-primary'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                          )}
                          onClick={() => {
                            onSelect(session.sessionId);
                            onClose();
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {session.title || '新会话'}
                            </div>
                            <div className="text-xs text-slate-400">
                              {formatTime(session.updateTime)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(session.sessionId);
                            }}
                            className="ml-2 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
              {Object.values(sessions).every((l) => l.length === 0) && (
                <div className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">暂无历史会话</div>
              )}
            </div>
          </>
        )}

        {collapsed && (
          <div className="flex flex-1 flex-col items-center gap-3 py-4">
            <button
              onClick={onNew}
              title="新建会话"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-primary/40 bg-primary-50 dark:bg-primary/10 text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
