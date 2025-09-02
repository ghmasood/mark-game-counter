'use client';

import GameCounter from '@/components/GameCounter';

import { useEffect } from 'react';

export default function Home() {
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     window.addEventListener('load', () => {
  //       navigator.serviceWorker.register('/sw.js');
  //     });
  //   }
  // }, []);

  return <GameCounter />;
}
