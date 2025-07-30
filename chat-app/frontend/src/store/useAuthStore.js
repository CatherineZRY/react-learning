import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data.user });
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket(); // 断开socket连接
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
      get().connectSocket();
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
  },
  connectSocket: () => {
    const { authUser, socket: existedSocket } = get();
    if (!authUser || existedSocket) return; // 如果用户未登录或者socket已经存在，则不连接
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      query: {
        userId: authUser._id,
      },
    });
    console.log('socket: ', socket);
    set({ socket });
    socket.on('getOnlineUsers', (userIds) => {
      console.log('get new online users: ', userIds);
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  }
}));

