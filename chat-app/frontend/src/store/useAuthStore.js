import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data.user });
    } catch (error) {
      console.log('error: ', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', formData);
      set({ authUser: res.data.user });
    } catch (error) {
      console.log('error: ', error);
    } finally {
      set({ isSigningUp: false });
    }
  }
}));

