'use client';

import dynamic from 'next/dynamic';

const CounterLazy = dynamic(() => import('@/components/GameCounter'));
export default function Home() {
  return <CounterLazy />;
}
