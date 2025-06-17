import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
type ChatInputProps = {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
const ChatInputForm = ({ message, onSubmit, onChange }: ChatInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='w-full rounded border-x border-t border-white p-1'
    >
      <Input
        type='text'
        className='rounded border-0 border-x border-t border-white py-6 placeholder:text-xs'
        placeholder='Type your message here...'
        value={message}
        onChange={onChange}
      />
      <Button type='submit'>X</Button>
    </form>
  );
};

export default ChatInputForm;
