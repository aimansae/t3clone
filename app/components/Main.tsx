'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';
import ChatInputForm from './ChatInputForm';
import { useSession } from 'next-auth/react'; // at the top

const Main2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sideBarWidth, setSideBarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);

  const [previousChats, setPreviousChats] = useState<
    {
      _id: string;
      title?: string;
    }[]
  >([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [chatTitle, setChatTitle] = useState('');
  const { data: session } = useSession();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message, chatId }),
      });
      const data = await res.json();
      console.log('Received chatId:', data.chatId);

      if (data.chatId && !chatId) {
        setChatId(data.chatId);
        if (!session?.user?.email) {
          localStorage.setItem('unauthenticated_chat', data.chatId);
        }
      }
      if (data.title && !chatTitle) {
        setChatTitle(data.title);
      }
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: message },
        { role: 'ai', text: data.reply },
      ]);
      setMessage('');
      console.log('submitted', 'user message', message);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  // load previous chats
  useEffect(() => {
    const fetchPreviousChats = async () => {
      if (!session?.user?.email) return;
      setChatsLoading(true);
      try {
        const res = await fetch(`/api/chats`);
        const data = await res.json();
        console.log('DATA FROM API', data);
        if (res.ok) {
          setPreviousChats(data.chats);
        } else {
          console.error('Error loading chats', data.error);
        }
      } catch (err) {
        console.error('failed to fetch chats', err);
      } finally {
        setChatsLoading(false);
      }
    };
    fetchPreviousChats();
  }, [session]);
  useEffect(() => {
    console.log('Session:', session);
  }, [session]);
  useEffect(() => {
    const linkChatToUnauthUser = async () => {
      const storedChatId = localStorage.getItem('unauthenticated_chat');
      if (!storedChatId && !session?.user?.email) return;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: storedChatId }),
        });

        if (res.ok) {
          console.log('Chat linked to user');
          localStorage.removeItem('unauthenticated_chat');
        } else {
          console.error('Failed to link chat to user');
        }
      } catch (error) {
        console.error('Error liking chat', error);
      }
    };
    linkChatToUnauthUser();
  }, [session]);
  const handleToggleSideBar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log('clicked');
  };
  const handleMouseUp = () => {
    setIsResizing(false);
  };
  const handleMouseDown = () => {
    setIsResizing(true);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 500) {
        setSideBarWidth(newWidth);
        console.log('new width id', newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  // load previous chats

  //close sidebar if clicked outside
  const handleCloseSidebar = (e: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node) &&
      window.innerWidth < 768
    ) {
      setIsSidebarOpen(false);
    }
    console.log('clicked outside');
  };
  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleCloseSidebar);
    } else {
      document.removeEventListener('mousedown', handleCloseSidebar);
    }
    return () => {
      document.removeEventListener('mousedown', handleCloseSidebar);
    };
  }, [isSidebarOpen]);
  return (
    <div className='relative flex h-screen p-2'>
      {/* Mobile Top Bar left*/}
      <MobileNav handleToggleSidebar={handleToggleSideBar} />
      {/*Sidebar*/}
      {isSidebarOpen && (
        <Sidebar
          messages={messages}
          sidebarRef={sidebarRef}
          sideBarWidth={sideBarWidth}
          isSidebarOpen={isSidebarOpen}
          onMouseDown={handleMouseDown}
          onToggleSideBar={handleToggleSideBar}
          isLoading={chatsLoading}
          previousChats={previousChats}
          onNewChat={() => console.log('clicked new chat')}
          chatId={chatId}
        />
      )}

      {/* Main Content */}
      <div
        className={`${messages.length ? 'pt-[10vh]' : 'pt-[25vh]'} mx-auto flex max-w-4xl flex-col`}
      >
        {messages.length === 0 ? (
          <div className='w-full flex-1 overflow-y-auto p-2'>
            <h1 className='text-3xl font-bold'>How can I help you?</h1>
            <div className='my-9 grid grid-cols-4'>
              <button>Create</button>
              <button>Explore</button>
              <button>Code</button>
              <button>Learn</button>
            </div>
          </div>
        ) : (
          <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-2'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`${msg.role === 'user' ? 'rounded-sm border bg-[#372e3e] text-right' : 'bg- self-start text-left'} p-2 text-center`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className='m-4 flex w-full justify-start'>
            <span className='bg-gray animate-pulse rounded-sm'>
              Ai is thinking...
            </span>
          </div>
        )}

        {/* Input Content */}
        <ChatInputForm
          message={message}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Main2;
export function formatGeminiResponse(text: string) {
  const lines = text.split('/n').filter(Boolean);
}
