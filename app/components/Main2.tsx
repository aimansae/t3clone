import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import ToggleIcon from './ToggleIcon';
import Logo from './Logo';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { IoIosClose } from 'react-icons/io';
import { LuSettings2 } from 'react-icons/lu';
import { MdOutlineLightMode } from 'react-icons/md';

const Main2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sideBarWidth, setSideBarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
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
    <div className='relative flex h-screen p-2 text-white'>
      {/* Mobile Top Bar left*/}
      <nav className='absolute top-2 left-0 flex w-full items-center justify-between gap-2 p-2'>
        <div>
          <Button className='p-0 text-white' onClick={handleToggleSideBar}>
            <ToggleIcon />
          </Button>
          <Button className='p-0 text-white'>
            <div className='cursor-pointer rounded p-1 font-bold hover:bg-white/10'>
              <CiSearch />
            </div>
          </Button>
        </div>
        {/*Right*/}
        <div className='flex items-center'>
          <Button className='p-0 text-white' onClick={handleToggleSideBar}>
            <div className='cursor-pointer rounded p-1 font-bold hover:bg-white/10'>
              <LuSettings2 />
            </div>
          </Button>
          <Button className='p-0 text-white'>
            <div className='cursor-pointer rounded p-1 font-bold hover:bg-white/10'>
              <MdOutlineLightMode />
            </div>
          </Button>
        </div>
      </nav>
      {/*Sidebar*/}
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          style={{ width: `${sideBarWidth}px` }}
          className={`relative h-screen flex-col gap-2 bg-[#20131d] p-2 text-[#f9f8fb] ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='flex'>
            <Button className='p-0 text-white' onClick={handleToggleSideBar}>
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
              {' '}
              <IoIosClose size={18} />
            </button>
          </div>
          {/* Resizer handle */}
          <div
            onMouseDown={handleMouseDown}
            className='absolute top-0 right-0 h-full w-1 bg-transparent hover:cursor-col-resize'
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`mx-auto flex max-w-4xl flex-col pt-[25vh]`}>
        <div className='w-full flex-1 overflow-y-auto p-2'>
          <h1 className='text-3xl font-bold'>How can I help you?</h1>
          <div className='my-9 grid grid-cols-4'>
            <button>Create</button>
            <button>Explore</button>
            <button>Code</button>
            <button>Learn</button>
          </div>
        </div>
        {/* Input Content */}
        <div className='w-full rounded border-x border-t border-white p-1'>
          <Input
            className='rounded border-0 border-x border-t border-white py-6 placeholder:text-xs'
            placeholder='Type your message here...'
          />
        </div>
      </div>
    </div>
  );
};

export default Main2;
