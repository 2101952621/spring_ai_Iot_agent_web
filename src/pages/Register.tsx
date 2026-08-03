import { Bot, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import type { RegisterForm } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'activeMailSent'>('form');

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email || !form.password) {
      setError('请输入邮箱和密码');
      return;
    }
    if (form.password.length < 6) {
      setError('密码至少需要 6 位');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await authApi.registerByEmail(form);
      setStep('activeMailSent');
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResendMail = async () => {
    setLoading(true);
    setError('');
    try {
      await authApi.sendRegisterMail(form.email);
      setSuccess('激活邮件已重新发送，请查收');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-brand-start via-white to-brand-end dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md p-8 border rounded-3xl border-white/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 shadow-float backdrop-blur">
        {step === 'form' ? (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
                <Bot size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">创建账号</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">注册一个万物互联领航员账号</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">邮箱 *</label>
                <div className="relative">
                  <Mail className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">姓</label>
                  <div className="relative">
                    <User className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="text"
                      value={form.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="姓氏"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">名</label>
                  <div className="relative">
                    <User className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="text"
                      value={form.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="名字"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">密码 *</label>
                <div className="relative">
                  <Lock className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">确认密码 *</label>
                <div className="relative">
                  <Lock className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.confirmPassword || ''}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="再次输入密码"
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
                {loading ? '注册中...' : '注 册'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              已有账号？
              <Link to="/login" className="ml-1 font-medium text-primary hover:underline">
                立即登录
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-card">
                <Mail size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">激活邮件已发送</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                我们已将激活邮件发送至
                <span className="font-medium text-slate-700 dark:text-slate-200">{form.email}</span>
                ，请前往邮箱查收并激活账号。
              </p>
            </div>

            {error && (
              <div className="px-3 py-2 mb-3 text-xs text-red-500 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/20">{error}</div>
            )}
            {success && (
              <div className="px-3 py-2 mb-3 text-xs text-green-600 dark:text-green-400 rounded-lg bg-green-50 dark:bg-green-900/20">{success}</div>
            )}

            <button
              onClick={handleResendMail}
              disabled={loading}
              className="w-full rounded-xl border border-dashed border-primary/40 bg-primary-50 dark:bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20 disabled:opacity-50"
            >
              {loading ? '发送中...' : '重新发送激活邮件'}
            </button>

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
