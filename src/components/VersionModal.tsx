import { useEffect, useRef, useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { cn } from '@/utils';

interface VersionItem {
  date: string;
  title: string;
  features?: string[];
  optimizations?: string[];
}

interface VersionModalProps {
  open: boolean;
  onClose: () => void;
}

const mockVersions: VersionItem[] = [
];

function TimelineDot() {
  return (
    <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-800" />
  );
}

export function VersionModal({ open, onClose }: VersionModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(mockVersions[0]?.date || '');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const selectedItem = mockVersions.find((v) => v.date === selectedDate);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 弹窗 */}
      <div
        ref={panelRef}
        className="relative z-10 flex h-[80vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-float"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">版本说明</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧时间线 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="relative ml-3 border-l border-slate-200 dark:border-slate-700">
              {mockVersions.map((item) => (
                <div
                  key={item.date}
                  className={cn(
                    'relative -ml-px mb-8 cursor-pointer pl-8 transition-colors',
                    selectedDate === item.date ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                  )}
                  onClick={() => setSelectedDate(item.date)}
                >
                  <TimelineDot />
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {item.title}
                  </div>

                  {item.features && item.features.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">【新增功能】</div>
                      <ul className="space-y-1">
                        {item.features.map((f, i) => (
                          <li key={i} className="text-sm text-slate-600 dark:text-slate-300">
                            {i + 1}. {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.optimizations && item.optimizations.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">【优化功能】</div>
                      <ul className="space-y-1">
                        {item.optimizations.map((o, i) => (
                          <li key={i} className="text-sm text-slate-600 dark:text-slate-300">
                            {i + 1}. {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-2 inline-flex items-center text-xs text-primary cursor-pointer hover:underline">
                    查看更多
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧更新日历 */}
          <div className="w-56 border-l border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-5 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Calendar size={16} />
              更新日历
            </div>
            <div className="space-y-2">
              {mockVersions.map((item) => (
                <button
                  key={item.date}
                  onClick={() => setSelectedDate(item.date)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selectedDate === item.date
                      ? 'bg-white dark:bg-slate-700 text-primary font-medium shadow-sm border-l-2 border-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200',
                  )}
                >
                  {item.date}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
