import { useEffect, useMemo, useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';
import { chatApi } from '@/api/chat';
import type { WebFunctionInfo } from '@/types';

interface FunctionPanelProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (payload: WebFunctionInfo | string) => void;
}

type TabKey = 'recommend' | 'functions' | 'params' | 'ai-do';

const AI_ACTIONS: { id: string; label: string; prompt: string }[] = [
  { id: 'export-logs', label: '帮我导出日志', prompt: '帮我导出日志' },
  { id: 'restart-device', label: '帮我重启设备', prompt: '帮我重启设备' },
  { id: 'wifi-password', label: '帮我给路由器设置一个级别较高的无线WIFI密码', prompt: '帮我给我家里路由器设置一个级别较高的无线WIFI密码' },
  { id: 'delete-logs', label: '删除系统2026-07-01到2026-07-31的日志', prompt: '删除系统2026-07-01到2026-07-31的日志' },
];

export function FunctionPanel({ open, onClose, onSelect }: FunctionPanelProps) {
  const [functions, setFunctions] = useState<WebFunctionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('functions');
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    chatApi
      .getFunctions()
      .then((list) => {
        setFunctions(list);
        // 默认选中第一个模块
        const modules = Array.from(new Set(list.map((f) => f.module).filter(Boolean)));
        if (modules.length > 0) setActiveCategory(modules[0] as string);
      })
      .catch(() => setFunctions([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setActiveTab('functions');
      setActiveCategory('');
    }
  }, [open]);

  const modules = useMemo(
    () => Array.from(new Set(functions.map((f) => f.module).filter(Boolean))) as string[],
    [functions]
  );

  const filtered = useMemo(() => {
    if (!activeCategory) return functions;
    return functions.filter((f) => f.module === activeCategory);
  }, [functions, activeCategory]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'recommend', label: '推荐' },
    { key: 'functions', label: '找功能' },
    { key: 'params', label: '问参数' },
    { key: 'ai-do', label: 'AI帮做' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700" style={{ maxHeight: '55vh' }}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  activeTab === t.key
                    ? 'text-primary bg-primary/10'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* 分类标签 */}
        {activeTab === 'functions' && modules.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => setActiveCategory(m)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border',
                  activeCategory === m
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-transparent bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* 分隔线 */}
        <div className="mx-4 border-b border-slate-100 dark:border-slate-700" />

        {/* 当前分类标题 */}
        {activeTab === 'functions' && activeCategory && (
          <div className="px-4 pt-3 pb-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {activeCategory}
            </span>
          </div>
        )}

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {activeTab === 'ai-do' ? (
            <div className="grid grid-cols-1 gap-3">
              {AI_ACTIONS.map((action) => (
                <div
                  key={action.id}
                  onClick={() => {
                    onSelect?.(action.prompt);
                    onClose();
                  }}
                  className={cn(
                    'group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all',
                    'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700',
                    'hover:border-primary/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
                  )}
                >
                  <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {action.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-slate-300 group-hover:text-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          ) : activeTab !== 'functions' ? (
            <div className="py-10 text-center text-sm text-slate-400">敬请期待</div>
          ) : loading ? (
            <div className="py-10 text-center text-sm text-slate-400">加载中...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              {activeCategory ? '该分类下暂无功能' : '暂无功能数据'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelect?.(f);
                    onClose();
                  }}
                  className={cn(
                    'group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all',
                    'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700',
                    'hover:border-primary/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
                  )}
                >
                  <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {f.functionName}
                  </span>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-slate-300 group-hover:text-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
