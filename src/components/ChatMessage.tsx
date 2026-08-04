import { Bot, User } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils';
import { FunctionCard } from './FunctionCard';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

function LinkRenderer({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:opacity-80"
    >
      {children}
    </a>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3 px-4 py-4',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow">
          <Bot size={16} />
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
          isUser
            ? 'bg-primary text-white'
            : 'border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200',
        )}
      >
        {message.loading && message.content === '' ? (
          <div className="w-full py-1">
            <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">正在思考</div>
            <div className="thinking-wave-bar" />
          </div>
        ) : isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div className="markdown-body">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: LinkRenderer,
              }}
            >
              {message.content}
            </Markdown>
            {message.functionCard && <FunctionCard data={message.functionCard} />}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400">
          <User size={16} />
        </div>
      )}
    </div>
  );
}
