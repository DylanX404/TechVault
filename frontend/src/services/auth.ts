import api, { setTokens, clearTokens } from './api';
import { LoginCredentials, RegisterData, User } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: { access: string; refresh: string } }> {
    const response = await api.post('/api/auth/login/', credentials);
    // dj-rest-auth with JWT returns 'access' and 'refresh' (or 'access_token'/'refresh_token' with custom serializer)
    const { access, refresh, access_token, refresh_token, user } = response.data;

    // Handle both response formats
    const accessToken = access_token || access;
    const refreshToken = refresh_token || refresh;

    setTokens({ access: accessToken, refresh: refreshToken });

    return {
      user,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    };
  },

  async register(data: RegisterData): Promise<{ user: User; tokens: { access: string; refresh: string } }> {
    const response = await api.post('/api/auth/registration/', data);
    // dj-rest-auth with JWT returns 'access' and 'refresh' (or 'access_token'/'refresh_token' with custom serializer)
    const { access, refresh, access_token, refresh_token, user } = response.data;

    // Handle both response formats
    const accessToken = access_token || access;
    const refreshToken = refresh_token || refresh;

    setTokens({ access: accessToken, refresh: refreshToken });

    return {
      user,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    };
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/user/profile/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch('/api/user/profile/', data);
    return response.data;
  },
};

export default authService;
