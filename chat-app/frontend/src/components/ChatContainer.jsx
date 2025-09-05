import { useChatStore } from '../store/useChatStore';
import { useEffect, useRef, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageDate } from '../lib/utils';
import useMessageVisibility from '../hooks/useMessageVisibility';
import LazyImage from './LazyImage';

function ChatContainer() {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessageLoading, selectedUser, subscribeToNewMessages, unsubscribeToNewMessages } = useChatStore();
  const chatContainerRef = useRef(null);
  const messageEndRef = useRef(null);
  const { visibleMessages, registerMessageObserver, refreshObserver } = useMessageVisibility(messages, chatContainerRef);

  
  const bindMessageObserver = useCallback((messageId) => {
    return (el) => {
      registerMessageObserver(messageId, el);
    }
  }, [registerMessageObserver]);

  useEffect(() => {
    refreshObserver();
  }, [refreshObserver, selectedUser]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToNewMessages();
    return () => {
      unsubscribeToNewMessages();
    };
  }, [getMessages, selectedUser, subscribeToNewMessages, unsubscribeToNewMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      <div 
        className='flex-1 overflow-y-auto p-4 space-y-4'
        ref={(el) => {
          chatContainerRef.current = el;
        }}>
        {messages.map((message) => (
          <div key={message._id}
            className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            ref={messageEndRef}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={
                  message.senderId === authUser._id
                    ? (authUser.profilePic || '\\avatar.png')
                    : (selectedUser.profilePic || '\\avatar.png')}
                  alt='profile pic'
                />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">
                {formatMessageDate(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex gap-2"
              data-id={message._id}
              ref={bindMessageObserver(message._id)}>
              {message.image && <LazyImage
                src={message.image}
                isVisible={visibleMessages.includes(message._id)} />}
              {message.text && <p>{message.text}</p>}            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div >
  )
}

export default ChatContainer;