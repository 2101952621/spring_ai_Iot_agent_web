import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Code2,
  Users,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Bot,
  Cpu,
  Wifi,
  Shield,
  Zap,
  Globe,
  X,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils';

/* ==================== IoT 网络连接动画 ==================== */
function IoTNetworkAnimation() {
  // 节点配置：位置(% x, y)，大小(px)，延迟(s)
  const nodes = [
    { x: 50, y: 50, size: 32, delay: 0, isCenter: true },
    { x: 18, y: 25, size: 16, delay: 0.5 },
    { x: 78, y: 20, size: 20, delay: 1.2 },
    { x: 85, y: 60, size: 14, delay: 0.8 },
    { x: 72, y: 82, size: 18, delay: 1.6 },
    { x: 28, y: 80, size: 22, delay: 2.0 },
    { x: 10, y: 55, size: 14, delay: 1.0 },
  ];

  // 连线（连接中心到外围）
  const centerNode = nodes[0];
  const edges = nodes.slice(1).map((n) => ({
    from: centerNode,
    to: n,
    delay: n.delay,
  }));

  return (
    <div className="pointer-events-none relative h-full w-full">
      {/* SVG 连线 */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge, i) => (
          <line
            key={i}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-600"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        ))}
        {/* 数据流粒子 */}
        {edges.map((edge, i) => (
          <circle
            key={`p-${i}`}
            r="1"
            fill="currentColor"
            className="text-primary"
          >
            <animateMotion
              dur={`${1.5 + i * 0.3}s`}
              repeatCount="indefinite"
              begin={`${edge.delay}s`}
              path={`M${edge.from.x},${edge.from.y} L${edge.to.x},${edge.to.y}`}
            />
          </circle>
        ))}
      </svg>

      {/* 节点 */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
        >
          {/* 外圈脉冲 */}
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2',
              node.isCenter
                ? 'border-primary/30'
                : 'border-slate-300/50 dark:border-slate-600/50',
            )}
            style={{
              width: node.size + 20,
              height: node.size + 20,
              animation: `iot-pulse 3s ease-out infinite`,
              animationDelay: `${node.delay}s`,
            }}
          />
          {/* 节点本体 */}
          <div
            className={cn(
              'relative rounded-full flex items-center justify-center shadow-lg transition-all',
              node.isCenter
                ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-primary dark:text-primary-light',
            )}
            style={{
              width: node.size,
              height: node.size,
              animation: node.isCenter
                ? 'iot-breathe 3s ease-in-out infinite'
                : `iot-blink ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${node.delay}s`,
            }}
          >
            {node.isCenter ? (
              <Cpu size={14} />
            ) : (
              <div
                className="rounded-full bg-primary/30"
                style={{ width: node.size * 0.45, height: node.size * 0.45 }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==================== 组件 ==================== */

function AnnouncementBar() {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">
      <Sparkles size={12} className="text-primary shrink-0" />
      <span>AI Agent v1.0.2 已上线，智能对话、一键打开功能、历史搜索新体验</span>
      <ArrowRight size={12} className="text-primary shrink-0" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur p-5 transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ==================== 联系作者弹窗 ==================== */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-float overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* 头部 */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50/60 dark:bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
            <Users size={13} />
            联系我们
          </div>
          <h3 className="mt-3 text-xl font-bold text-slate-800 dark:text-slate-100">
            联系作者
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            扫码添加作者，一起共创未来
          </p>
        </div>

        {/* 二维码区 */}
        <div className="grid grid-cols-2 gap-4 px-6 pb-6">
          {/* 微信 */}
          <div className="flex flex-col items-center rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 p-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              <div className="h-4 w-4 rounded-sm bg-emerald-500" />
              微信
            </div>
            <div className="relative h-36 w-36 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-white">
              <img
                src="/assets/qr-wechat.jpg"
                alt="作者微信二维码"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 text-center">
              扫码添加微信好友
            </p>
          </div>

          {/* QQ */}
          <div className="flex flex-col items-center rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 p-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              <div className="h-4 w-4 rounded-sm bg-blue-500" />
              QQ
            </div>
            <div className="relative h-36 w-36 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-white">
              <img
                src="/assets/qr-qq.jpg"
                alt="作者QQ二维码"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 text-center">
              扫码添加QQ好友
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            期待与您的交流，共同探索物联网的无限可能
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-start via-white to-brand-end dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* ===== 导航栏 ===== */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light text-white shadow-card">
            <Bot size={18} />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-primary to-primary-light bg-clip-text text-lg font-bold text-transparent">
            万物互联领航员
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <AnnouncementBar />

      {/* ===== Hero 区域 ===== */}
      <section className="flex flex-1 items-center px-6 py-12 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* 左侧文案 */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary-50/60 dark:bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
                <Sparkles size={13} />
                AI 驱动的物联网智能平台整合方案
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
                让万物互联
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-light to-blue-400 bg-clip-text text-transparent">
                  触手可及
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
                基于大语言模型的智能物联网方案整合平台，通过自然语言交互即可轻松管理设备、
                查询数据、获取洞察，让复杂的技术变得简单直观。
              </p>
              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] active:translate-y-0"
                >
                  <MessageCircle size={16} />
                  开始对话
                </button>
                <button
                  onClick={() => navigate('/version-notes')}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  了解详情
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 右侧视觉 */}
            <div className="relative mx-auto h-[320px] w-full max-w-[480px] sm:h-[380px] lg:h-[440px]">
              {/* 软背景 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-blue-300/5 dark:from-primary/10 dark:to-blue-500/5 border border-slate-100 dark:border-slate-700" />
              {/* 动画 */}
              <div className="absolute inset-4">
                <IoTNetworkAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 核心能力区 ===== */}
      <section className="px-6 pb-16 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50/60 dark:bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
              核心能力
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
              一个平台，无限可能
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              三大核心能力，全面覆盖物联网场景
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<MessageCircle size={20} />}
              title="智能对话"
              description="通过自然语言与 AI 交互，一键打开功能、调取数据、获取平台实时洞察"
            />
            <FeatureCard
              icon={<Globe size={20} />}
              title="开放接口"
              description="标准化 RESTful API，快速集成到自有系统，实现自动化运维与数据互联"
            />
            <FeatureCard
              icon={<Shield size={20} />}
              title="安全可靠"
              description="企业级解决方案，包含多种实战场景"
            />
          </div>
        </div>
      </section>

      {/* ===== 底部 CTA ===== */}
      <section className="border-t border-slate-100 dark:border-slate-700">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50/60 dark:bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
              <Users size={13} />
              加入我们
            </div>
            <div className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              与我们一起构建更智能的物联网生态
            </div>
          </div>
          <button
            onClick={() => setContactOpen(true)}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5"
          >
            联系作者
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ===== 联系作者弹窗 ===== */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* ===== 页脚 ===== */}
      <footer className="border-t border-slate-100 dark:border-slate-700 px-6 py-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <Bot size={10} className="text-primary" />
            </div>
            <span>© {new Date().getFullYear()} 万物互联领航员 — All rights reserved</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors"></span>
            <span className="hover:text-primary cursor-pointer transition-colors">隐私政策</span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              <Wifi size={12} className="inline mr-0.5" />
              物联网平台
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
