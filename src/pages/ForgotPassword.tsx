import { Bot, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('请输入邮箱地址');
      return;
    }

    setLoading(true);
    try {
      await authApi.sendResetPasswordMail(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-brand-start via-white to-brand-end dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md p-8 border rounded-3xl border-white/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 shadow-float backdrop-blur">
        {!sent ? (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
                <Bot size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">忘记密码</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">输入注册邮箱，我们将发送密码重置链接</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="请输入注册邮箱"
                  />
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
                {loading ? '发送中...' : '发送重置邮件'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
                <Mail size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">邮件已发送</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                我们已将密码重置链接发送至
                <span className="font-medium text-slate-700 dark:text-slate-200 ml-1">{email}</span>
                ，请前往邮箱查收并按提示重置密码。
              </p>
            </div>
          </>
        )}

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-medium text-primary hover:underline">
            返回登录
          </Link>
        </p>
      </div>
    </div>
  );
}
