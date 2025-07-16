import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

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
      toast.success('Account created successfully!');
      set({ authUser: res.data.user });
    } catch (error) {
      console.log('error: ', error);
      toast.error('Error: ' + error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success('Logged out successfully!');
      set({ authUser: null });
    } catch (error) {
      console.log('error: ', error);
      toast.error('Error: ' + error.response.data.message);
    }
  },
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', formData);
      toast.success('Logged in successfully!');
      set({ authUser: res.data.user });
    } catch (error) {
      console.log('error: ', error);
      toast.error('Error: ' + error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update_profile', formData);
      toast.success('Profile updated successfully!');
      set({ authUser: res.data.user });
    } catch (error) {
      console.log('error: ', error);
      toast.error('Error: ' + error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}));

