import { RefreshCw, Sparkles } from 'lucide-react';
import type { Example } from '@/types';

interface ExampleQuestionsProps {
  examples: Example[];
  onSelect: (question: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  disabled?: boolean;
}

export function ExampleQuestions({ examples, onSelect, onRefresh, refreshing, disabled }: ExampleQuestionsProps) {
  return (
    <div className="w-full max-w-2xl p-6 mx-auto border rounded-2xl border-slate-100 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 shadow-card backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Sparkles className="text-primary" size={20} />
          我是你的AI助理
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title="换一批"
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            刷新
          </button>
        )}
      </div>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">打开功能，查产品，我来做！</p>

      <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">可以试着问我：</div>
      <div className="space-y-2">
        {examples.map((item, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelect(item.describe)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm transition-all bg-white dark:bg-slate-800 border shadow-sm rounded-xl border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-primary/30 hover:shadow-float disabled:opacity-50 disabled:cursor-not-allowed"
          >
            
            <span className="text-left">{item.title}: {item.describe}</span>
            <span className="px-3 py-1 text-xs font-medium rounded-full shrink-0 bg-primary-50 dark:bg-primary/20 text-primary dark:text-primary-light">
              试试
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
