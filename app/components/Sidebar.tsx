import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from './Logo';
import ToggleIcon from './ToggleIcon';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { IoIosClose } from 'react-icons/io';

type SidebarProps = {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  sideBarWidth: number;
  isSidebarOpen: boolean;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onToggleSideBar: () => void;
  messages?: { role: string; text: string }[];
};
const Sidebar = ({
  messages,
  sidebarRef,
  sideBarWidth,
  isSidebarOpen,
  onToggleSideBar,
  onMouseDown,
}: SidebarProps) => {
  return (
    <div
      ref={sidebarRef}
      style={{ width: `${sideBarWidth}px` }}
      className={`relative h-screen flex-col gap-2 bg-[#20131d] p-2 text-[#f9f8fb] ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex'>
        <Button className='p-0 text-white' onClick={onToggleSideBar}>
          <ToggleIcon />

          <Link href='/'>
            <Logo />
          </Link>
        </Button>
      </div>

      <div className='w-full text-center'>
        <Button className='w-full justify-center border border-[#b04680] bg-[#A3004c33] px-2 py-1 text-center text-sm text-[#fbd0e8] hover:bg-[#a3004c75]'>
          New Chat
        </Button>
      </div>
      <div className='flex w-full items-center'>
        <CiSearch className='absolute left-2' size={16} />
        <Input
          className='border-0 pl-6 text-sm placeholder:text-sm focus:ring-0 focus:outline-none'
          id='search'
          type='text'
          placeholder='search your chats'
        />
        <button>
          <IoIosClose size={18} />
        </button>
      </div>
      <div>
        {messages?.map((msg, index) => <li key={index}>{msg.text}</li>)}
      </div>

      {/* Resizer handle */}
      <div
        onMouseDown={onMouseDown}
        className='absolute top-0 right-0 h-full w-1 bg-transparent hover:cursor-col-resize'
      />
    </div>
  );
};

export default Sidebar;
