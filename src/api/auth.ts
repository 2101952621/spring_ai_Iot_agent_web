import { http } from './request';
import type { LoginForm, User } from '@/types';

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  scope?: string;
}

export const authApi = {
  login: (data: LoginForm) =>
    http.post<LoginResponse>('/auth/login', {
      username: data.username,
      password: data.password,
    }),

  /** 获取当前登录用户信息 */
  getUser: () => http.get<User>('/auth/user'),
};
