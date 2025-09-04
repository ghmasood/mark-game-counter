import Link from 'next/link';
import React from 'react';

function Page() {
  return (
    <div className='fade-in min-h-[calc(100dvh_-_9rem)] bg-gray-50 p-4 max-w-md mx-auto rounded-2xl relative flex flex-col'>
      <ol className='text-gray-600 list-[upper-roman] flex flex-col gap-3 px-4'>
        <li className='text-justify'>
          اگر یک تیم تقلب کرد و تیم مقابل متوجه شد ۱۶۵ به ضرر تیم متقلب است ،
          ولی تیمی که متوجه تقلب شده است می تواند به بازی ادامه دهد و تیم متقلب
          را شلم کند.
        </li>
        <li className='text-justify'>
          اگر تیم حریف رو دست پخش کننده بولی نزنه بعد از دیدن دست و قبل از خوندن
          امکان اینکه تیم حریف بگه مجدد دست بدین هستش
        </li>
        <li className='text-justify'>
          بیان جملات و کلماتی مانند کمی پاس، پاس کچکه، مری تکی نداری و امثالهم
          ممنوع می‌باشد و در صورت ارتکاب ۱۶۵ به امتیازات حریف اضافه می‌شود
        </li>
      </ol>
      <Link href='/' className='mt-auto w-full'>
        <button className='rounded-xl py-1 cursor-pointer hover:bg-indigo-600 transition-colors w-full bg-indigo-500 text-white'>
          بازگشت به شمارنده
        </button>
      </Link>
    </div>
  );
}

export default Page;
