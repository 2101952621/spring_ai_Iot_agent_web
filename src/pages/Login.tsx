import { Bot, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-brand-start via-white to-brand-end dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md p-8 border rounded-3xl border-white/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 shadow-float backdrop-blur">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
            <Bot size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">万物互联领航员</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">物联网平台的专用AI助手</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">用户名</label>
            <div className="relative">
              <User className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">密码</label>
            <div className="relative">
              <Lock className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-10 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="请输入密码"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 dark:text-slate-500"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 text-xs text-red-500 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/20">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-light py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/register" className="text-primary hover:underline">
            注册账号
          </Link>
          <Link to="/forgot-password" className="text-slate-400 dark:text-slate-500 hover:text-primary hover:underline">
            忘记密码？
          </Link>
        </div>
      </div>
    </div>
  );
}
