import { Sparkles } from 'lucide-react';
import type { Example } from '@/types';

interface ExampleQuestionsProps {
  examples: Example[];
  onSelect: (question: string) => void;
}

export function ExampleQuestions({ examples, onSelect }: ExampleQuestionsProps) {
  return (
    <div className="w-full max-w-2xl p-6 mx-auto border rounded-2xl border-slate-100 bg-white/70 shadow-card backdrop-blur">
      <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
        <Sparkles className="text-primary" size={20} />
        我是你的AI助理
      </div>
      <p className="mb-5 text-sm text-slate-500">打开功能，查产品，我来做！</p>

      <div className="mb-3 text-sm font-medium text-slate-700">可以试着问我：</div>
      <div className="space-y-2">
        {examples.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.describe)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm transition-all bg-white border shadow-sm rounded-xl border-slate-100 text-slate-700 hover:border-primary/30 hover:shadow-float"
          >
            
            <span className="text-left">{item.title}: {item.describe}</span>
            <span className="px-3 py-1 text-xs font-medium rounded-full shrink-0 bg-primary-50 text-primary">
              试试
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
