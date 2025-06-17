'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import userProfile from '@/public/images/userprofile.png';
export default function SignInButton({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  console.log('************Signed in via:', session); // 'google' or 'github'
  return session ? (
    <div className='bg-gray-500'>
      <div>Signed in as {session.user?.email}</div>
      <div>
        <Image
          src={session.user?.image || userProfile}
          width={30}
          height={30}
          alt='avatar'
          className=''
        />
      </div>
      <button
        onClick={() => {
          signOut();
          onClose();
        }}
        className='rounded bg-red-500 px-4 py-2 text-white'
      >
        Sign out
      </button>
    </div>
  ) : (
    <div
      onClick={onClose}
      className='fixed inset-0 z-50 flex flex-col items-center justify-center rounded bg-black/80'
    >
      <div className='flex flex-col gap-4 border border-white bg-black p-10'>
        <button
          onClick={() => signIn('github')}
          className='cursor-pointer rounded bg-gray-400 px-4 py-2 hover:bg-gray-400/80'
        >
          Sign in with Github
        </button>
        <button
          onClick={() => signIn('google')}
          className='cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-500/60'
        >
          Sign in with Google
        </button>
        <button
          onClick={onClose}
          className='mt-2 rounded bg-gray-200 px-4 py-2 text-black hover:bg-white/80'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
