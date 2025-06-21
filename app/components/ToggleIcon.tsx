export default function ToggleIcon() {
  return (
    <div className='cursor-pointer rounded p-1 hover:bg-white/10 dark:text-white'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-[#7e104d] dark:text-white'
      >
        <rect width='18' height='18' x='3' y='3' rx='2'></rect>
        <path d='M9 3v18'></path>
      </svg>
    </div>
  );
}
