import Link from 'next/link';
import React from 'react';

function Page() {
  return (
    <div className='min-h-[calc(100dvh_-_9rem)] bg-gray-50 p-4 max-w-md mx-auto rounded-2xl relative flex flex-col'>
      <ol className='text-gray-600 list-[upper-roman] px-4'>
        <li className='text-justify'>
          اگر یک تیم تقلب کرد و تیم مقابل متوجه شد 165 به ضرر تیم متقلب است ،
          ولی تیمی که متوجه تقلب شده است می تواند به بازی ادامه دهد و تیم متقلب
          را شلم کند.
        </li>
      </ol>
      <Link href='/' className='mt-auto w-full'>
        <button className='rounded-xl py-1 cursor-pointer hover:bg-indigo-600 transition-colors w-full bg-indigo-500 text-white'>
          بازگشت به بازی
        </button>
      </Link>
    </div>
  );
}

export default Page;
