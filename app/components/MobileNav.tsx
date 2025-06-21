'use client';
import React, { useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import ToggleIcon from './ToggleIcon';
import { IoSearchSharp } from 'react-icons/io5';
import SignInButton from './SignInButton';
import { FaUser } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NavBarProps = {
  handleToggleSidebar: () => void;
};
const MobileNav = ({ handleToggleSidebar }: NavBarProps) => {
  const { theme, setTheme } = useTheme();
  const [showSigninModal, setShowSigninModal] = useState(false);
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const { data: session } = useSession();

  return (
    <nav className='absolute top-2 left-0 flex w-full items-center justify-between gap-2 p-2 text-pink-400 dark:text-white'>
      <div className='flex items-center gap-1 px-1 dark:bg-[#090809]'>
        <Button
          className='p-0 text-pink-600 dark:bg-[#090809] dark:text-white'
          onClick={handleToggleSidebar}
        >
          <ToggleIcon />
        </Button>
        <Button className='p-0 text-white dark:bg-[#090809]'>
          <div className='cursor-pointer rounded p-1 font-bold hover:bg-white/10'>
            <IoSearchSharp className='text-[#7e104d] dark:text-white' />
          </div>
        </Button>
      </div>
      {/*Right*/}
      <div className='flex items-center gap-1 px-1 dark:bg-[#090809]'>
        <Button
          className='p-0 text-white dark:bg-[#090809]'
          onClick={() => setShowSigninModal(true)}
        >
          <div className='cursor-pointer rounded p-1 font-bold hover:bg-white/10'>
            <LuSettings2 className='text-[#7e104d] dark:text-white' />
          </div>
        </Button>
        {session && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className='rounded p-0 text-white hover:rounded dark:bg-[#090809]'
                onClick={() => signOut()}
              >
                <FaUser className='p-0' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{session && 'Logout'}</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          className='p-0 text-[#7e104d] dark:bg-[#090809] dark:text-white'
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className='text-yellow-300 transition-all dark:scale-0' />
          ) : (
            <Sun className='p-0 text-white'></Sun>
          )}
        </Button>
      </div>
      {showSigninModal && (
        <SignInButton
          visible={showSigninModal}
          onClose={() => setShowSigninModal(false)}
        />
      )}
    </nav>
  );
};

export default MobileNav;
