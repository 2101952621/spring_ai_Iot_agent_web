import { Bot, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const slides = ['/assets/login-slide-1.png', '/assets/login-slide-2.png'];

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f7fa] dark:bg-slate-950">
      {/* Dynamic background — only fills the area outside carousel & login form */}
      <div className="login-dynamic-bg" aria-hidden="true">
        <span className="login-bg-node" style={{ top: '18%', left: '8%', animationDelay: '0s' }} />
        <span className="login-bg-node" style={{ top: '32%', left: '22%', animationDelay: '1.5s' }} />
        <span className="login-bg-node" style={{ top: '12%', left: '42%', animationDelay: '3s' }} />
        <span className="login-bg-node" style={{ top: '66%', left: '12%', animationDelay: '2s' }} />
        <span className="login-bg-node" style={{ top: '78%', left: '35%', animationDelay: '4s' }} />
        <span className="login-bg-node" style={{ top: '22%', left: '68%', animationDelay: '2.5s' }} />
        <span className="login-bg-node" style={{ top: '58%', left: '78%', animationDelay: '1s' }} />
        <span className="login-bg-node" style={{ top: '82%', left: '88%', animationDelay: '3.5s' }} />
        <span
          className="login-bg-line"
          style={{ top: '25%', left: '10%', width: '180px', transform: 'rotate(18deg)', animationDelay: '0.5s' }}
        />
        <span
          className="login-bg-line"
          style={{ top: '72%', left: '15%', width: '220px', transform: 'rotate(-12deg)', animationDelay: '2.5s' }}
        />
        <span
          className="login-bg-line"
          style={{ top: '35%', left: '70%', width: '160px', transform: 'rotate(-20deg)', animationDelay: '1.5s' }}
        />
        <span
          className="login-bg-line"
          style={{ top: '68%', left: '65%', width: '200px', transform: 'rotate(10deg)', animationDelay: '3.5s' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-16 w-full items-center justify-start gap-10 px-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light">
            <Bot size={18} className="text-white" />
          </div>
          <span className="text-base font-semibold text-slate-800 dark:text-slate-100">Spring AI IoT</span>
        </div>
        <nav className="flex items-center gap-8 text-base text-slate-600 dark:text-slate-400">
          <a href="#" className="hover:text-primary">首页</a>
          <a href="#" className="hover:text-primary">产品</a>
          <a href="#" className="hover:text-primary">联系我们</a>
          <a href="#" className="hover:text-primary">解决方案</a>
          <a href="#" className="hover:text-primary">帮助中心</a>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex w-full max-w-[1280px] items-stretch justify-center gap-10 xl:gap-16">
          {/* Left panel - carousel image */}
          <div className="relative hidden w-[62%] max-w-[880px] lg:block">
            <div className="ai-carousel-bg relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              {slides.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`login slide ${idx + 1}`}
                  className={`absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-700 ${
                    idx === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* Carousel dots */}
            <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right panel - login form */}
          <div className="flex w-full max-w-[420px] flex-col rounded-[24px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:bg-slate-800 sm:p-10">
          <div className="mb-8 flex items-center justify-center gap-6 border-b border-slate-100 pb-4 dark:border-slate-700">
            {['账号登录', '短信登录', '扫码登录'].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(idx)}
                className={`relative pb-2 text-sm font-medium transition-colors ${
                  activeTab === idx ? 'text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {tab}
                {activeTab === idx && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {activeTab === 0 ? (
              <div className="flex h-full flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">用户名</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                      placeholder="请输入用户名"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                      placeholder="请输入密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-900/20 dark:text-red-400">{error}</div>
                )}

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-primary hover:underline dark:text-slate-500">
                    忘记密码？
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? '登录中...' : '登 录'}
                </button>

                <div className="flex items-center justify-center gap-6 text-xs">
                  <Link to="/register" className="text-primary hover:underline">
                    创建账号
                  </Link>
                  <Link to="/activate" className="text-primary hover:underline">
                    激活账号
                  </Link>
                </div>
              </form>
              </div>
            ) : activeTab === 1 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <span className="text-2xl">📱</span>
                </div>
                短信登录功能开发中
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <span className="text-2xl">📷</span>
                </div>
                扫码登录功能开发中
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
  );
}
