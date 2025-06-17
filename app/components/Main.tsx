'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';
import ChatInputForm from './ChatInputForm';
import { Darumadrop_One } from 'next/font/google';
import { MdGrid3X3, MdSportsGolf } from 'react-icons/md';

const Main2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sideBarWidth, setSideBarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('submitted');
    if (!message.trim()) return;
    const userMessage = message;
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', text: userMessage },
          { role: 'ai', text: data.reply },
        ]);
      } else {
        console.error('Gemini error', data.error);
      }
    } catch (err) {
      console.log(err);
      console.error('Failed to fetch', err);
    }
  };
  // load previous chats
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch('/api/chat');
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Error fetching chat:', err);
      }
    };
    fetchChat();
  }, []);

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
        />
      )}

      {/*Chat*/}

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
                <span
                  className={`${msg.role === 'user' ? 'rounded-sm border bg-[#372e3e] text-right' : 'bg- self-start text-left'} p-2`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
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
