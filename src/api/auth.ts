import { http } from './request';
import type { LoginForm, RegisterForm, ResetPasswordForm, User } from '@/types';

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  scope?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface TokenCheckResponse {
  message: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

export const authApi = {
  /** 登录 */
  login: (data: LoginForm) =>
    http.post<LoginResponse>('/auth/login', {
      username: data.username,
      password: data.password,
    }),

  /** 获取当前登录用户信息 */
  getUser: () => http.get<User>('/auth/user'),

  /** 发送注册激活邮件 */
  sendRegisterMail: (email: string) =>
    http.post<MessageResponse>('/customer/sendRegisterMail', { email }),

  /** 通过邮箱注册 */
  registerByEmail: (data: RegisterForm) =>
    http.post<RegisterResponse>('/customer/registerByEmail', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    }),

  /** 校验激活 Token */
  checkActivateToken: (activateToken: string) =>
    http.get<TokenCheckResponse>('/noauth/activate', { params: { activateToken } }),

  /** 激活账号 */
  activateUser: (activateToken: string) =>
    http.post<MessageResponse>('/noauth/activate', { activateToken }),

  /** 发送密码重置邮件 */
  sendResetPasswordMail: (email: string) =>
    http.post<MessageResponse>('/noauth/resetPasswordByEmail', { email }),

  /** 校验重置 Token */
  checkResetToken: (resetToken: string) =>
    http.get<TokenCheckResponse>('/noauth/resetPassword', { params: { resetToken } }),

  /** 重置密码 */
  resetPassword: (data: ResetPasswordForm) =>
    http.post<MessageResponse>('/noauth/resetPassword', {
      email: data.email,
      newPassword: data.newPassword,
      resetToken: data.resetToken,
      verificationCode: data.verificationCode,
    }),

  /** 修改密码 */
  changePassword: (oldPassword: string, newPassword: string) =>
    http.post<MessageResponse>('/auth/changePassword', { oldPassword, newPassword }),
};
