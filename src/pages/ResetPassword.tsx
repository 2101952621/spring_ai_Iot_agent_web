import { Bot, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/auth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get('resetToken') || '';

  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      setCheckError('无效的重置链接，缺少 token 参数');
      setChecking(false);
      return;
    }
    authApi
      .checkResetToken(resetToken)
      .then((res) => {
        setEmail(res.email);
        setChecking(false);
      })
      .catch((err) => {
        setCheckError(err instanceof Error ? err.message : '链接已过期或无效');
        setChecking(false);
      });
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('密码至少需要 6 位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        newPassword,
        resetToken,
      });
      setSuccess('密码重置成功');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-brand-start via-white to-brand-end dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md p-8 border rounded-3xl border-white/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 shadow-float backdrop-blur">
        {checking ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="mb-4 animate-spin text-primary" size={48} />
            <p className="text-sm text-slate-500 dark:text-slate-400">正在验证重置链接...</p>
          </div>
        ) : checkError ? (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
                <Bot size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">链接无效</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{checkError}</p>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                重新获取重置链接
              </Link>
            </p>
          </>
        ) : success ? (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-green-500 rounded-2xl shadow-card">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">重置成功</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">即将跳转到登录页面...</p>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="font-medium text-primary hover:underline">
                立即登录
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
                <Bot size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">重置密码</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                为账号 <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span> 设置新密码
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">新密码</label>
                <div className="relative">
                  <Lock className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-10 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="至少 6 位密码"
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

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">确认密码</label>
                <div className="relative">
                  <Lock className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="再次输入新密码"
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
                {loading ? '重置中...' : '重 置 密 码'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="font-medium text-primary hover:underline">
                返回登录
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
