import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Sparkles, Bug, Zap, Layers } from 'lucide-react';
import { cn } from '@/utils';
import { chatApi } from '@/api/chat';
import type { VersionItem } from '@/types';

function TimelineDot({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        'h-2.5 w-2.5 rounded-full ring-4 transition-colors',
        active
          ? 'bg-primary ring-primary/20'
          : 'bg-slate-300 dark:bg-slate-600 ring-white dark:ring-slate-800',
      )}
    />
  );
}

interface ContentBlock {
  type: string;
  items: string[];
}

function parseContent(content?: string): ContentBlock[] | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed as ContentBlock[];
  } catch {
    // not json
  }
  return null;
}

const typeMeta: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; label: string }> = {
  '新增功能': {
    icon: <Sparkles size={14} />,
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    label: '新增功能',
  },
  'bugfix': {
    icon: <Bug size={14} />,
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    label: '问题修复',
  },
  '修复': {
    icon: <Bug size={14} />,
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    label: '问题修复',
  },
  '优化': {
    icon: <Zap size={14} />,
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    label: '优化',
  },
  '基础功能': {
    icon: <Layers size={14} />,
    color: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-200 dark:border-sky-800',
    label: '基础功能',
  },
};

function getMeta(type: string) {
  return typeMeta[type] || {
    icon: <Layers size={14} />,
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    border: 'border-slate-200 dark:border-slate-700',
    label: type,
  };
}

function ContentRenderer({ content }: { content?: string }) {
  const blocks = parseContent(content);
  if (!blocks) {
    return (
      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        const meta = getMeta(block.type);
        return (
          <div
            key={idx}
            className={cn(
              'rounded-lg border p-3',
              meta.bg,
              meta.border,
            )}
          >
            <div className={cn('flex items-center gap-1.5 text-xs font-semibold mb-2', meta.color)}>
              {meta.icon}
              {meta.label}
            </div>
            <ul className="space-y-1.5">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', meta.color.replace('text-', 'bg-'))} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function VersionNotes() {
  const navigate = useNavigate();
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    chatApi
      .getVersions()
      .then((list) => {
        setVersions(list);
        if (list.length > 0) setSelectedDate(list[0].releaseDate);
      })
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const el = itemRefs.current[date];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
              加载中...
            </div>
          ) : versions.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-500">
              暂无版本记录
            </div>
          ) : (
            <div className="relative mx-auto max-w-3xl">
              {/* 中间竖线 */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-700" />

              {versions.map((item) => (
                <div
                  key={item.releaseDate}
                  ref={(el) => { itemRefs.current[item.releaseDate] = el; }}
                  className={cn(
                    'relative flex items-start py-6 transition-colors',
                    selectedDate === item.releaseDate ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                  )}
                  onClick={() => setSelectedDate(item.releaseDate)}
                >
                  {/* 左侧：日期 + 标题 */}
                  <div className="w-1/2 pr-8 pt-1 text-right">
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                      {item.releaseDate}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </div>
                  </div>

                  {/* 中间圆点 */}
                  <div className="absolute left-1/2 top-7 -translate-x-1/2">
                    <TimelineDot active={selectedDate === item.releaseDate} />
                  </div>

                  {/* 右侧：内容 */}
                  <div className="w-1/2 pl-8">
                    {item.content && (
                      <ContentRenderer content={item.content} />
                    )}
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
          {versions.length === 0 ? (
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {loading ? '加载中...' : '暂无记录'}
            </div>
          ) : (
            <div className="space-y-1">
              {versions.map((item) => (
                <button
                  key={item.releaseDate}
                  onClick={() => handleDateClick(item.releaseDate)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selectedDate === item.releaseDate
                      ? 'bg-slate-100 dark:bg-slate-700 text-primary font-medium shadow-sm border-l-2 border-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200',
                  )}
                >
                  {item.releaseDate}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
