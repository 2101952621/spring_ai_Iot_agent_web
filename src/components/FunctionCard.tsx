import { ExternalLink, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils';
import type { WebFunctionInfo } from '@/types';

interface FunctionCardProps {
  data: WebFunctionInfo;
}

function resolveOpenUrl(data: WebFunctionInfo): string | null {
  const path = data.openUrl || data.functionPath;
  if (!path) return null;
  const origin = window.location.origin;
  if (/^https?:\/\//i.test(path)) {
    if (/test\.com\.cn/i.test(path)) {
      const urlObj = new URL(path);
      return origin + urlObj.pathname + urlObj.search + urlObj.hash;
    }
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return origin + normalizedPath;
}

export function FunctionCard({ data }: FunctionCardProps) {
  const url = resolveOpenUrl(data);
  const buttonText = data.buttonText || '打开';

  const handleOpen = () => {
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
      <div className="px-4 pt-4 pb-3">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          打开{data.functionName}
        </h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          是否需要我帮你打开「{data.functionName}」？
        </p>

        <button
          onClick={handleOpen}
          disabled={!url}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors',
            url
              ? 'bg-primary hover:bg-primary-light'
              : 'cursor-not-allowed bg-slate-300 dark:bg-slate-600'
          )}
        >
          <ExternalLink size={15} />
          {buttonText}
        </button>
      </div>

      {(data.description || data.precautions || data.configMethod) && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 space-y-3">
          {data.description && (
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.description}
            </div>
          )}

          {data.configMethod && (
            <div className="markdown-body text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: data.configMethod }} />
            </div>
          )}

          {data.precautions && (
            <div className="flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400"
              />
              <div className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                <span className="font-medium">注意事项：</span>
                {data.precautions}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
