'use client';
import { useGameStore } from '@/store/useGameStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function Page() {
  const { setLabels, labels } = useGameStore();

  const [weLabel, setWeLabel] = useState(labels.we ?? '');
  const [youLabel, setYouLabel] = useState(labels.you ?? '');

  useEffect(() => {
    setWeLabel(labels.we);
    setYouLabel(labels.you);
  }, [labels]);

  return (
    <div className='fade-in min-h-[calc(100dvh_-_9rem)] bg-gray-50 p-4 max-w-md mx-auto rounded-2xl relative flex flex-col'>
      <div className='flex flex-col gap-2'>
        <label className='text-gray-700 '>
          <span className='z-[1] relative bg-gray-50 start-3 px-1'>
            نام تیم ما:
          </span>
          <input
            value={weLabel}
            onChange={(e) => setWeLabel(e.target.value)}
            placeholder={`ما`}
            className='w-full -translate-y-3 px-2 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-black'
          />
        </label>

        <label className='text-gray-700 '>
          <span className='z-[1] relative bg-gray-50 start-3 px-1'>
            نام تیم شما:
          </span>
          <input
            value={youLabel}
            onChange={(e) => setYouLabel(e.target.value)}
            placeholder={`شما`}
            className='w-full -translate-y-3 px-2 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-black'
          />
        </label>
      </div>
      <Link href='/' className='mt-auto w-full'>
        <button
          onClick={() =>
            setLabels({
              we: weLabel ? weLabel : 'ما',
              you: youLabel ? youLabel : 'شما',
            })
          }
          className='rounded-xl py-1 cursor-pointer hover:bg-indigo-600 transition-colors w-full bg-indigo-500 text-white'
        >
          ذخیره و بازگشت به شمارنده
        </button>
      </Link>
    </div>
  );
}

export default Page;
