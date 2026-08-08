import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { authApi } from '@/api/auth';
import { cn } from '@/utils';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const infoItems = [
    { icon: User, label: '用户ID', value: user?.uuidId || '-' },
    { icon: Mail, label: '邮箱', value: user?.email || '-' },
    { icon: User, label: '姓名', value: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '-' },
    { icon: Shield, label: '角色权限', value: user?.authority || '-' },
    { icon: Building2, label: '租户ID', value: user?.tenantId || '-' },
    { icon: Building2, label: '客户ID', value: user?.customerId || '-' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('请填写所有密码字段');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('新密码与确认密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      setError('新密码长度至少为6位');
      return;
    }

    setSaving(true);
    try {
      const resp = await authApi.changePassword(oldPassword, newPassword);
      setMessage(resp.message || '密码修改成功');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '密码修改失败';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cn('min-h-screen', isDark ? 'dark bg-slate-900' : 'bg-slate-50')}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 顶部返回 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft size={16} />
          返回
        </button>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
          账号设置
        </h1>

        {/* 基本信息卡片 */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              基本信息
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 p-4"
              >
                <div className="mt-0.5 rounded-lg bg-white dark:bg-slate-700 p-1.5 shadow-sm">
                  <item.icon size={16} className="text-slate-400 dark:text-slate-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200 break-all">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 修改密码卡片 */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <KeyRound size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              修改密码
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                当前密码
              </label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="请输入当前密码"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                新密码
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                确认新密码
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {message && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 size={16} />
                {message}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all',
                  saving
                    ? 'bg-primary/70 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark shadow-sm hover:shadow',
                )}
              >
                <Save size={16} />
                {saving ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
