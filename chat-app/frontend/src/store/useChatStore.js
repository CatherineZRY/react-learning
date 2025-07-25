import { create } from 'zustand';
import axiosInstance from '../lib/axios';


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get('/messages/users');
      set({ users: response.data, isUserLoading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data, isMessageLoading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ isMessageLoading: false });
    }
  },
  // TODO:optimize this later
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  sendMessage: async (messageData) => {
    const { selectedUser, getMessages } = get();
    try {
      const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      if (response.status === 200) {
        getMessages(selectedUser._id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}));

