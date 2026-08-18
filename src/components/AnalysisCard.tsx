import {
  AlertOctagon,
  AlertTriangle,
  Info,
  TrendingUp,
  Users,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils';
import type { AnalysisPreviewData, LogInsight } from '@/types';

interface AnalysisCardProps {
  data: AnalysisPreviewData;
}

const levelConfig: Record<
  LogInsight['level'],
  { icon: typeof AlertOctagon; bg: string; border: string; text: string; label: string }
> = {
  DANGER: {
    icon: AlertOctagon,
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    label: '危险',
  },
  WARNING: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    label: '警告',
  },
  INFO: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    label: '提示',
  },
};

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  POST: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  PUT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function AnalysisCard({ data }: AnalysisCardProps) {
  const dangerCount = data.insights?.filter((i) => i.level === 'DANGER').length ?? 0;
  const warningCount = data.insights?.filter((i) => i.level === 'WARNING').length ?? 0;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} />
          <span className="text-sm font-semibold">操作日志分析预览</span>
        </div>
        <p className="mt-0.5 text-xs text-indigo-100">
          {data.timeRange} · 共 {data.totalLogs} 条日志 · {data.uniqueUserCount} 位用户
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
        <StatBox
          icon={<Zap size={14} />}
          label="DELETE 操作"
          value={`${data.deleteTotal}`}
          sub={`成功率 ${data.deleteSuccessRate}%`}
          color="text-red-600 dark:text-red-400"
        />
        <StatBox
          icon={<AlertTriangle size={14} />}
          label="错误请求"
          value={`${data.errorCount}`}
          sub={`错误率 ${data.errorRate}%`}
          color="text-orange-600 dark:text-orange-400"
        />
        <StatBox
          icon={<Clock size={14} />}
          label="平均耗时"
          value={`${data.avgTimeMs}`}
          sub="ms"
          color="text-blue-600 dark:text-blue-400"
        />
        <StatBox
          icon={<Users size={14} />}
          label="最活跃用户"
          value={data.mostActiveUser ?? '-'}
          sub={`${data.mostActiveUserCount} 次操作`}
          color="text-green-600 dark:text-green-400"
        />
      </div>

      {/* CRUD 分布条形图 */}
      {data.crudStats && Object.keys(data.crudStats).length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3">
          <h5 className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            请求方式分布
          </h5>
          <div className="flex gap-2">
            {Object.entries(data.crudStats).map(([method, count]) => {
              const total = Object.values(data.crudStats).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={method} className="flex-1">
                  <div
                    className={cn(
                      'mb-1 flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold',
                      methodColors[method] || 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {method}
                  </div>
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {count} 次
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-current opacity-60"
                      style={{ width: `${pct}%`, color: method === 'DELETE' ? '#ef4444' : method === 'POST' ? '#22c55e' : method === 'PUT' ? '#f97316' : '#3b82f6' }}
                    />
                  </div>
                  <div className="mt-0.5 text-center text-[10px] text-slate-400">
                    {pct.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 高频接口 TOP5 */}
      {data.topOperations && data.topOperations.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3">
          <h5 className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            高频操作接口 TOP5
          </h5>
          <div className="space-y-1.5">
            {data.topOperations.map((op, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
                    idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : 'bg-slate-400',
                  )}
                >
                  {idx + 1}
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold',
                    methodColors[op.method] || 'bg-slate-100 text-slate-600',
                  )}
                >
                  {op.method}
                </span>
                <span className="flex-1 truncate text-slate-600 dark:text-slate-300" title={op.url}>
                  {op.url}
                </span>
                <span className="shrink-0 font-semibold text-slate-500 dark:text-slate-400">
                  {op.count} 次
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DELETE 操作用户分布 */}
      {data.topDeleteUsers && Object.keys(data.topDeleteUsers).length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3">
          <h5 className="mb-2 text-xs font-semibold text-red-500 dark:text-red-400">
            DELETE 操作用户分布
          </h5>
          <div className="space-y-1">
            {Object.entries(data.topDeleteUsers).map(([user, count]) => (
              <div key={user} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">{user}</span>
                <span className="font-semibold text-red-500 dark:text-red-400">{count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI 智能洞察 */}
      {data.insights && data.insights.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              AI 智能洞察与运维建议
            </h5>
            {(dangerCount > 0 || warningCount > 0) && (
              <div className="flex gap-1.5">
                {dangerCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {dangerCount} 项危险
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    {warningCount} 项警告
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {data.insights.map((insight, idx) => {
              const cfg = levelConfig[insight.level] || levelConfig.INFO;
              const Icon = cfg.icon;
              return (
                <div
                  key={idx}
                  className={cn('rounded-lg border p-2.5', cfg.bg, cfg.border)}
                >
                  <div className="flex items-start gap-2">
                    <Icon size={15} className={cn('mt-0.5 shrink-0', cfg.text)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-[10px] font-bold rounded px-1 py-0.5', cfg.text, 'bg-white/60 dark:bg-slate-900/30')}>
                          {cfg.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {insight.title}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {insight.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold">建议：</span>
                        {insight.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className={cn('mt-0.5 truncate text-sm font-bold', color)} title={value}>
        {value}
      </div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</div>
    </div>
  );
}
