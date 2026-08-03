import { Send, Square } from 'lucide-react';
import { cn } from '@/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  loading: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  loading,
  placeholder = '请输入内容',
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
      <div className="relative flex items-end gap-2 px-3 py-2 border rounded-2xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-card">
        <textarea
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
          className="max-h-[120px] min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder={placeholder}
        />
        {loading ? (
          <button
            onClick={onStop}
            className="flex items-center justify-center transition-colors rounded-full h-9 w-9 shrink-0 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500"
          >
            <Square size={16} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
              value.trim()
                ? 'bg-primary text-white hover:bg-primary-light'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500',
            )}
          >
            <Send size={16} />
          </button>
        )}
      </div>
      <div className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
        内容由万物互联领航员AI大模型生成，重要信息请核对
      </div>
    </div>
  );
}
