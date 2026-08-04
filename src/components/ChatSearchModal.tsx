import { useEffect, useRef, useState } from 'react';
import { Search, X, Clock, MessageSquareText, Loader2 } from 'lucide-react';
import { chatApi } from '@/api/chat';
import { cn, formatTime } from '@/utils';
import type { ChatMessageSearchVO } from '@/types';

interface ChatSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (sessionId: string) => void;
}

export function ChatSearchModal({ open, onClose, onSelect }: ChatSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ChatMessageSearchVO[]>([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);

  // 聚焦输入框
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setKeyword('');
      setResults([]);
      setTotal(0);
      setSearched(false);
      setLoading(false);
    }
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // 防抖搜索
  useEffect(() => {
    if (!open) return;
    const trimmed = keyword.trim();
    if (!trimmed) {
      setResults([]);
      setTotal(0);
      setSearched(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await chatApi.searchMessages(trimmed, 1, 20);
        setResults(data.items || []);
        setTotal(data.total || 0);
        setSearched(true);
      } catch {
        setResults([]);
        setTotal(0);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, open]);

  const handleSelect = (item: ChatMessageSearchVO) => {
    onSelect(item.sessionId);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 搜索面板 */}
      <div className="relative z-10 flex w-[90vw] max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl max-h-[70vh]">
        {/* 搜索输入 */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 px-4 py-3">
          <Search size={20} className="shrink-0 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索历史会话消息..."
            className="flex-1 bg-transparent text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
          />
          {keyword && (
            <button
              onClick={() => {
                setKeyword('');
                inputRef.current?.focus();
              }}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* 结果区 */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 dark:text-slate-500">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">搜索中...</span>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 dark:text-slate-500">
              <MessageSquareText size={32} />
              <span className="text-sm">未找到与 "{keyword.trim()}" 相关的历史消息</span>
            </div>
          )}

          {!searched && !loading && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400 dark:text-slate-500">
              <Search size={32} className="mb-2 opacity-50" />
              <span className="text-sm">输入关键词搜索历史会话消息</span>
              <span className="text-xs text-slate-300 dark:text-slate-600">支持按消息内容进行全文检索</span>
            </div>
          )}

          <div className="space-y-1">
            {results.map((item) => (
              <button
                key={item.messageId}
                onClick={() => handleSelect(item)}
                className="flex w-full flex-col gap-2 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <MessageSquareText
                      size={14}
                      className={cn(
                        'shrink-0',
                        item.messageType === 'USER'
                          ? 'text-primary'
                          : 'text-emerald-500',
                      )}
                    />
                    <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.sessionTitle || '新会话'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Clock size={12} />
                    {formatTime(item.createTime)}
                  </div>
                </div>

                <div className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.highlight ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: item.highlight }}
                      className="[&_em]:font-semibold [&_em]:text-primary [&_em]:not-italic"
                    />
                  ) : (
                    item.messageContent
                  )}
                </div>
              </button>
            ))}
          </div>

          {searched && results.length > 0 && (
            <div className="py-3 text-center text-xs text-slate-400 dark:text-slate-500">
              共 {total} 条结果，显示前 {results.length} 条
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
