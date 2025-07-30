import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';

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
  getMessages: async (userId, needRefresh = true) => {
    if (needRefresh) {
      set({ isMessageLoading: true });
    }
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data, isMessageLoading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ isMessageLoading: false });
    }
  },
  subscribeToNewMessages: () => {
    if (!useAuthStore.getState().socket || !get().selectedUser) return; // 如果当前没有选中的用户，就不订阅
    const { socket } = useAuthStore.getState();
    socket?.on('newMessage', (newMessage) => {
      console.log('get new message: ', newMessage);
      // 如果新消息的接收者是当前选中的用户，则将新消息添加到消息列表中
      if (get().selectedUser._id === newMessage.senderId) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    });
  },
  unsubscribeToNewMessages: () => {
    const { socket } = useAuthStore.getState();
    socket?.off('newMessage');
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  sendMessage: async (messageData) => {
    const { selectedUser, getMessages } = get();
    try {
      const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      if (response.status === 200) {
        getMessages(selectedUser._id, false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}));

