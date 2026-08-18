import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { cn } from '@/utils';
import { chatApi } from '@/api/chat';
import type { DownloadEventData } from '@/types';

interface ReportDownloadCardProps {
  data: DownloadEventData;
}

export function ReportDownloadCard({ data }: ReportDownloadCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await chatApi.downloadFile(data.downloadUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (err) {
      console.error('报告下载失败:', err);
    } finally {
      setDownloading(false);
    }
  };

  const sizeKb = data.fileSize ? (data.fileSize / 1024).toFixed(1) : null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white">
          <FileText size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            操作日志分析报告（Word）
          </h4>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {data.fileName}
            {sizeKb && <span className="ml-1">· {sizeKb} KB</span>}
          </p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={cn(
          'mx-4 mb-3 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
          downloaded
            ? 'bg-green-500 text-white'
            : downloading
              ? 'cursor-wait bg-indigo-300 text-white'
              : 'bg-indigo-500 text-white hover:bg-indigo-600',
        )}
      >
        {downloading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            正在下载...
          </>
        ) : downloaded ? (
          <>
            <Download size={15} />
            已下载，点击重新下载
          </>
        ) : (
          <>
            <Download size={15} />
            下载 Word 分析报告
          </>
        )}
      </button>
    </div>
  );
}
