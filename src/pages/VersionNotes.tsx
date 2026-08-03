import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { cn } from '@/utils';

interface VersionItem {
  date: string;
  title: string;
  features?: string[];
  optimizations?: string[];
}

const mockVersions: VersionItem[] = [
];

function TimelineDot() {
  return (
    <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-800" />
  );
}

export default function VersionNotes() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(mockVersions[0]?.date || '');

  const selectedItem = mockVersions.find((v) => v.date === selectedDate);

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* 头部导航 */}
      <header className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={18} />
          返回
        </button>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">版本说明</h1>
      </header>

      {/* 内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧时间线 */}
        <div className="flex-1 overflow-y-auto p-6">
          {mockVersions.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
              暂无版本记录
            </div>
          ) : (
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
          )}
        </div>

        {/* 右侧更新日历 */}
        <div className="w-56 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Calendar size={16} />
            更新日历
          </div>
          {mockVersions.length === 0 ? (
            <div className="text-xs text-slate-400 dark:text-slate-500">暂无记录</div>
          ) : (
            <div className="space-y-2">
              {mockVersions.map((item) => (
                <button
                  key={item.date}
                  onClick={() => setSelectedDate(item.date)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selectedDate === item.date
                      ? 'bg-slate-100 dark:bg-slate-700 text-primary font-medium shadow-sm border-l-2 border-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200',
                  )}
                >
                  {item.date}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
