import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { FaArrowUp } from 'react-icons/fa6';

type ChatInputProps = {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
const ChatInputForm = ({ message, onSubmit, onChange }: ChatInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='flex w-full rounded border-x border-t border-white p-1'
    >
      <div className='relative flex w-full items-start rounded border-0 border-x border-t border-white'>
        <Input
          type=' text'
          className='w-full border-0 bg-yellow-200 py-6 placeholder:text-xs'
          placeholder='Type your message here...'
          value={message}
          onChange={onChange}
        />
        <Button
          className='absolute top-2 right-4 border-0 bg-[#372e3e] p-0'
          type='submit'
        >
          <FaArrowUp size={12} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInputForm;
