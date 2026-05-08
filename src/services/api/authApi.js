import { apiClient } from './apiClient';

export const getCurrentUser = (authHeader) =>
  apiClient.get('/auth/me', {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
