'use client';
import { cn } from '@/utils';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

type PropsType = {
  className?: string;
};
function DateTimer({ className = '' }: PropsType) {
  const [time, setTime] = useState(
    DateTime.now().setLocale('fa').toLocaleString(DateTime.DATETIME_MED)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = DateTime.now()
        .setLocale('fa')
        .toLocaleString(DateTime.DATETIME_MED);
      setTime(now);
    }, 1000 * 60);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={cn('text-gray-600 text-sm font-semibold', className)}>
      {time}
    </div>
  );
}

export default DateTimer;
