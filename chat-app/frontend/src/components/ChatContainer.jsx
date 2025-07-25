import { useChatStore } from '../store/useChatStore';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

function ChatContainer() {
  const { messages, getMessages, isMessageLoading, selectedUser } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [getMessages, selectedUser]);

  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />

      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <p>messages...</p>
      <MessageInput />
    </div>
  )
}

export default ChatContainer;