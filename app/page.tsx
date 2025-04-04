'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to explore page
    router.push('/explore');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-pulse text-gray-400">
        Loading dashboard...
      </div>
    </div>
  );
}
